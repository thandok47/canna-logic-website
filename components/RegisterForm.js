import { useState } from "react"
import { createClient } from "@supabase/supabase-js"

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function RegisterForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [usernameStatus, setUsernameStatus] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // Check username availability
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
      const resJson = await res.json()

      if (resJson.error) {
        setUsernameStatus("error")
      } else if (resJson.available) {
        setUsernameStatus("available")
      } else {
        setUsernameStatus("taken")
      }
    } catch (err) {
      console.error(err)
      setUsernameStatus("error")
    }
  }

  // Handle signup
  const handleSignup = async () => {
    setLoading(true)
    setErrorMessage("")
    setSuccessMessage("")

    // Step 1: Sign up with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    const userId = data?.user?.id
    if (!userId) {
      setErrorMessage("No user ID returned from Supabase")
      setLoading(false)
      return
    }

    // Step 2: Insert/Upsert username into profiles table
    const { error: insertError } = await supabase
      .from("profiles")
      .upsert({ id: userId, username })

    if (insertError) {
      setErrorMessage(insertError.message)
      setLoading(false)
      return
    }

    setSuccessMessage("Signup successful! Please check your email for confirmation.")
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto" }}>
      <h2>Register for Canna Logic</h2>

      <input
