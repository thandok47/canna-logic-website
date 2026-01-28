"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(null)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // this stores username in user_metadata
      },
    })

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    // Optionally insert into profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .insert([{ id: data.user.id, username }])

    if (profileError) {
      setError(profileError.message)
      return
    }

    router.push("/auth/role") // next step: choose role
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Create your Canna Logic account</h1>
      <form onSubmit={handleRegister} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="input input-bordered w-full"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Register
        </button>
      </form>
    </div>
  )
}
