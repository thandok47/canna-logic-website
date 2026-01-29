// components/AuthProvider.js
"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient" // ← use relative path, not @/...

const AuthContext = createContext({
  session: null,
  user: null,
  signOut: async () => {},
})

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [user, setUser] = useState(null)

  useEffect(() => {
    let mounted = true
    let subscription = null

    const init = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession()
        if (!mounted) return
        setSession(initialSession ?? null)
        setUser(initialSession?.user ?? null)

        const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession ?? null)
          setUser(newSession?.user ?? null)
        })
        subscription = data?.subscription ?? null
      } catch (err) {
        // swallow init errors; keep state null
        console.error("AuthProvider init error:", err)
      }
    }

    init()

    return () => {
      mounted = false
      if (subscription && typeof subscription.unsubscribe === "function") {
        subscription.unsubscribe()
      }
    }
  }, [])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setSession(null)
      setUser(null)
    } catch (err) {
      console.error("Sign out error:", err)
    }
  }

  return (
    <AuthContext.Provider value={{ session, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
