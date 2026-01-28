"use client"
import { useEffect, useState } from "react"

export default function RecentActivityClient() {
  const [items, setItems] = useState(null)
  useEffect(() => {
    // fetch from an API route or client-safe endpoint
    fetch("/api/recent-activity")
      .then(r => r.json())
      .then(setItems)
      .catch(() => setItems([]))
  }, [])

  if (!items) return <div className="muted">Loading recent activity…</div>
  return (
    <ul>
      {items.map(i => <li key={i.id} className="muted">{i.text}</li>)}
    </ul>
  )
}
