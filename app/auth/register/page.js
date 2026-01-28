// app/auth/register/page.js
"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "../../../lib/supabaseClient" // adjust if your lib path differs

// Simple password strength scorer (0-4)
function passwordScore(pw) {
  let score = 0
  if (!pw) return 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function RegisterPage() {
  const router = useRouter()
  const mountedRef = useRef(true)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [age, setAge] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [usernameStatus, setUsernameStatus] = useState("") // "", "checking", "available", "taken", "error"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    return () => {
      mountedRef.current = false
    }
  }, [])

  // Generate a base username from names
  const generateBaseUsername = (first, last) => {
    const f = (first || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "")
    const l = (last || "").trim().toLowerCase().replace(/[^a-z0-9]/g, "")
    if (f && l) return `${f}.${l}`.slice(0, 30)
    if (f) return f.slice(0, 30)
    if (l) return l.slice(0, 30)
    return `user${Math.floor(Math.random() * 9000) + 1000}`
  }

  // Ask server to check username availability
  const checkUsernameAvailability = async (candidate) => {
    if (!candidate) {
      setUsernameStatus("")
      return
    }
    setUsernameStatus("checking")
    try {
      const res = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: candidate }),
      })
      const json = await res.json()
      if (!res.ok) {
        setUsernameStatus("error")
        setInfo(null)
        return
      }
      setUsernameStatus(json.available ? "available" : "taken")
      setInfo(json.available ? "Username available" : "Username taken")
    } catch (err) {
      setUsernameStatus("error")
      setInfo("Could not check username availability")
    }
  }

  // Auto-suggest username when name fields blur or change
  const handleAutoSuggest = async () => {
    const base = generateBaseUsername(firstName, lastName)
    setUsername(base)
    await checkUsernameAvailability(base)
  }

  // Helper to focus first invalid field
  const focusFirstInvalid = () => {
    if (!firstName.trim()) return document.querySelector('input[name="firstName"]')?.focus()
    if (!lastName.trim()) return document.querySelector('input[name="lastName"]')?.focus()
    if (!email.trim()) return document.querySelector('input[name="email"]')?.focus()
    if (!age) return document.querySelector('input[name="age"]')?.focus()
    if (!password) return document.querySelector('input[name="password"]')?.focus()
    if (!username) return document.querySelector('input[name="username"]')?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    // client-side validation
    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your full name and surname.")
      focusFirstInvalid()
      return
    }
    if (!email.trim()) {
      setError("Please enter your email address.")
      focusFirstInvalid()
      return
    }
    const ageNum = Number(age)
    if (!age || Number.isNaN(ageNum) || ageNum < 18) {
      setError("You must be at least 18 years old to register.")
      focusFirstInvalid()
      return
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters.")
      focusFirstInvalid()
      return
    }
    if (!username) {
      setError("Please choose a username.")
      focusFirstInvalid()
      return
    }
    if (usernameStatus === "checking") {
      setError("Please wait while username availability is checked.")
      return
    }
    if (usernameStatus === "taken") {
      setError("That username is taken. Please choose another or modify it.")
      focusFirstInvalid()
      return
    }

    setLoading(true)

    try {
      // Final server-side availability check before signUp (optional but reduces race)
      const checkRes = await fetch("/api/check-username", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      })
      const checkJson = await checkRes.json()
      if (!checkRes.ok || checkJson.available === false) {
        setError("Username is no longer available. Please choose another.")
        setUsernameStatus("taken")
        setLoading(false)
        return
      }

      // Sign up with Supabase Auth, store username and profile data in user_metadata
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            age: ageNum,
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        setLoading(false)
        return
      }

      // Attempt to insert profile row as fallback (trigger may already create it)
      if (signUpData?.user?.id) {
        const profileRow = {
          id: signUpData.user.id,
          username,
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          age: ageNum,
          role: null,
        }

        const { error: profileError } = await supabase.from("profiles").insert([profileRow])

        if (profileError) {
          // If duplicate key (trigger already created profile) ignore; otherwise surface
          const isDuplicate = /duplicate key|unique constraint/i.test(profileError.message || "")
          if (!isDuplicate) {
            setError(profileError.message)
            setLoading(false)
            return
          }
        }
      }

      // Redirect to role selection or onboarding
      router.push("/auth/role")
    } catch (err) {
      setError("Registration failed. Please try again.")
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }

  const score = passwordScore(password)
  const scoreLabel = score < 2 ? "Weak" : score === 2 ? "Fair" : score === 3 ? "Good" : "Strong"

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Create your account</h1>

      <form onSubmit={handleSubmit} className="space-y-4" aria-live="polite" noValidate>
        <div>
          <label className="block text-sm font-medium">Full name</label>
          <input
            name="firstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            onBlur={handleAutoSuggest}
            required
            className="input input-bordered w-full mt-1"
            aria-invalid={!firstName.trim() ? "true" : "false"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Surname</label>
          <input
            name="lastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            onBlur={handleAutoSuggest}
            required
            className="input input-bordered w-full mt-1"
            aria-invalid={!lastName.trim() ? "true" : "false"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email address</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input input-bordered w-full mt-1"
            aria-invalid={!email.trim() ? "true" : "false"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Age</label>
          <input
            name="age"
            type="number"
            min={18}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="input input-bordered w-full mt-1"
            aria-invalid={!age || Number(age) < 18 ? "true" : "false"}
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Username (editable)</label>
          <div className="flex items-center gap-2 mt-1">
            <input
              name="username"
              type="text"
              value={username}
              onChange={(e) => { setUsername(e.target.value); setUsernameStatus("") }}
              onBlur={() => checkUsernameAvailability(username)}
              required
              className="input input-bordered flex-1"
              aria-invalid={usernameStatus === "taken" ? "true" : "false"}
            />
            <button
              type="button"
              onClick={() => checkUsernameAvailability(username)}
              className="px-3 py-1 rounded bg-slate-100 text-sm"
              aria-label="Check username availability"
            >
              Check
            </button>
          </div>
          <div className="mt-1 text-sm">
            {usernameStatus === "checking" && <span className="text-gray-600">Checking…</span>}
            {usernameStatus === "available" && <span className="text-green-600">Available</span>}
            {usernameStatus === "taken" && <span className="text-red-600">Taken</span>}
            {usernameStatus === "error" && <span className="text-yellow-600">Could not check</span>}
            {info && usernameStatus !== "checking" && <div className="text-xs text-gray-600 mt-1">{info}</div>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Password</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input input-bordered w-full mt-1"
            aria-describedby="password-help password-strength"
            aria-invalid={password.length < 8 ? "true" : "false"}
          />
          <div id="password-help" className="text-xs text-gray-600 mt-1">
            Minimum 8 characters. Use a mix of letters, numbers, and symbols for stronger passwords.
          </div>

          {/* Password strength meter */}
          <div id="password-strength" className="mt-2" aria-live="polite">
            <div className="h-2 w-full bg-gray-200 rounded overflow-hidden">
              <div
                style={{ width: `${(score / 4) * 100}%` }}
                className={`h-2 rounded transition-all duration-200 ${
                  score >= 3 ? "bg-green-500" : score === 2 ? "bg-yellow-400" : "bg-red-500"
                }`}
                role="progressbar"
                aria-valuenow={score}
                aria-valuemin={0}
                aria-valuemax={4}
              />
            </div>
            <div className="text-xs mt-1 text-gray-600">{scoreLabel}</div>
          </div>
        </div>

        {error && (
          <div className="text-red-600" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-60"
        >
          {loading ? "Creating account…" : "Create account"}
        </button>
      </form>
    </div>
  )
}
