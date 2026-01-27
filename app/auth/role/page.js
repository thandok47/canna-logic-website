"use client"
import { useRouter } from 'next/navigation'

export default function RolePage() {
  const router = useRouter()

  const handleRole = (role) => {
    router.push(`/dashboard/${role}`)
  }

  return (
    <div>
      <h1>Select your role</h1>
      <div className="roles">
        {['customer','investor','student','staff','executive','devs','restricted'].map(role => (
          <button key={role} onClick={()=>handleRole(role)}>
            {role.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
