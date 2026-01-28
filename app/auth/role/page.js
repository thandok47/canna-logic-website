"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function RolePage() {
  const [role, setRole] = useState("")
  const [error, setError] = useState(null)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    // Get current session
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setError("You must be signed in to set a role.")
      return
    }

    // Update profile with chosen role
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", session.user.id)

    if (updateError) {
      setError(updateError.message)
      return
    }

    // Redirect to dashboard (middleware will route to correct role dashboard)
    router.push("/dashboard")
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Choose your role</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          className="select select-bordered w-full"
        >
          <option value="">Select a role</option>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
          <option value="educator">Educator</option>
        </select>
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">
          Continue
        </button>
      </form>
    </div>
  )
}
