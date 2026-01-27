"use client"
import { useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [message, setMessage] = useState('')

  const handleRegister = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } }
    })
    if (error) setMessage(error.message)
    else setMessage('Check your email for verification link!')
  }

  return (
    <div className="form-container">
      <h1>Create your Canna Logic profile</h1>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button type="submit">Register</button>
      </form>
      <p>{message}</p>
    </div>
  )
}
