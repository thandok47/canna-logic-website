"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AgePage() {
  const [age, setAge] = useState('')
  const router = useRouter()

  const handleSubmit = () => {
    if (parseInt(age) < 18) {
      router.push('/harm-reduction')
    } else {
      router.push('/auth/role')
    }
  }

  return (
    <div>
      <h1>Age Verification</h1>
      <input type="number" placeholder="Enter your age" value={age} onChange={(e)=>setAge(e.target.value)} />
      <button onClick={handleSubmit}>Continue</button>
    </div>
  )
}
