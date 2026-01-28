"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { supabase } from "../lib/supabaseClient"

/**
 * Drop this file at /app/page.js
 * Requires TailwindCSS configured and images placed in /public (see notes below).
 */

function Spinner() {
  return (
    <div role="status" aria-live="polite" className="flex items-center justify-center">
      <svg className="animate-spin h-10 w-10 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span className="sr-only">Loading</span>
    </div>
  )
}

function Hero({ session, role, onSignIn, onDashboard }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-green-400">
          Canna Logic
        </h1>
        <p className="mt-4 text-gray-300 max-w-xl">
          Revolutionizing the RSA cannabis industry through compliance, education, and community.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          {!session ? (
            <button
              onClick={onSignIn}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 text-gray-900 font-semibold px-5 py-2 rounded transition"
              aria-label="Sign in to Canna Logic"
            >
              Sign in
            </button>
          ) : (
            <button
              onClick={() => onDashboard(role)}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 focus:ring-2 focus:ring-green-300 text-gray-900 font-semibold px-5 py-2 rounded transition"
              aria-label="Go to your dashboard"
            >
              Go to your dashboard
            </button>
          )}

          <a
            href="/learn"
            className="inline-flex items-center gap-2 border border-gray-700 text-gray-200 px-5 py-2 rounded hover:bg-gray-800 focus:ring-2 focus:ring-green-300"
            aria-label="Learn more about Canna Logic"
          >
            Learn more
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-green-300">Compliance</h4>
            <p className="text-gray-300 text-sm mt-1">Age verification, legal guidance, and safe use resources.</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg">
            <h4 className="text-sm font-semibold text-green-300">Community</h4>
            <p className="text-gray-300 text-sm mt-1">Workshops, outreach, and local events.</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center">
        <div className="w-full max-w-md bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg">
          <div className="relative h-56 w-full rounded-md overflow-hidden bg-gray-900 flex items-center justify-center">
            <Image
              src="/hero-illustration.png"
              alt="Illustration showing compliance, community and commerce"
              fill
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
          <p className="mt-4 text-gray-300 text-sm">
            Trusted, compliant, and community-first. Built for South Africa.
          </p>
        </div>
      </div>
    </section>
  )
}

function PromoGrid() {
  const promos = [
    { title: "Featured Products", desc: "Curated, compliant products for responsible use.", href: "/shop" },
    { title: "Workshops", desc: "Sign up for harm-reduction and education sessions.", href: "/events" },
    { title: "Investor Portal", desc: "Access reports and funding opportunities.", href: "/investor" },
  ]

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid md:grid-cols-3 gap-6">
        {promos.map((p) => (
          <article key={p.title} className="bg-gray-800 p-6 rounded-lg hover:scale-[1.01] transition" aria-labelledby={`promo-${p.title}`}>
            <h3 id={`promo-${p.title}`} className="text-lg font-semibold text-green-300">{p.title}</h3>
            <p className="mt-2 text-gray-300 text-sm">{p.desc}</p>
            <a href={p.href} className="mt-4 inline-block text-sm text-green-200 underline">Explore</a>
          </article>
        ))}
      </div>
    </section>
  )
}

function RoleHighlights({ role }) {
  const commonCard = (title, desc, href) => (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h4 className="text-lg font-semibold text-green-300">{title}</h4>
      <p className="mt-2 text-gray-300 text-sm">{desc}</p>
      {href && <a href={href} className="mt-4 inline-block text-sm text-green-200 underline">Open</a>}
    </div>
  )

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-4">Your quick view</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {role === "customer" && commonCard("Shop highlights", "Featured products and quick order access.", "/dashboard/customer")}
        {role === "investor" && commonCard("Investor snapshot", "Latest reports and funding opportunities.", "/dashboard/investor")}
        {role === "student" && commonCard("Learning", "Upcoming workshops and harm-reduction modules.", "/dashboard/student")}
        {role === "staff" && commonCard("Staff quick view", "Shift preview and inventory alerts.", "/dashboard/staff")}
        {role === "executive" && commonCard("Compliance dashboard", "High-level logs and cross-role insights.", "/dashboard/executive")}
        {role === "devs" && commonCard("Developer sandbox", "API docs and testing tools.", "/dashboard/devs")}
        {role === "restricted" && commonCard("Admin access", "Restricted administrative tools.", "/dashboard/restricted")}
      </div>
    </section>
  )
}

export default function HomePage() {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  const [role, setRole] = useState(null)
  const [error, setError] = useState(null)
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    async function init() {
      setLoading(true)
      setError(null)

      try {
        const { data } = await supabase.auth.getSession()
        const session = data?.session ?? null
        if (!mounted) return
        setSession(session)

        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", session.user.id)
            .single()

          if (profileError && profileError.code !== "PGRST116") {
            // PGRST116 sometimes appears when no row exists; handle gracefully
            setError("Unable to load profile. Please complete your role selection.")
          } else {
            setRole(profile?.role ?? null)
          }
        }
      } catch (err) {
        setError("Unexpected error while checking session.")
        console.error(err)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    init()

    // Subscribe to auth changes to keep UI in sync
    const { data: listener } = supabase.auth.onAuthStateChange((_event, sessionPayload) => {
      if (!mounted) return
      setSession(sessionPayload?.session ?? null)
      // If signed out, clear role
      if (!sessionPayload?.session) setRole(null)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  const handleSignIn = () => router.push("/auth/signin")
  const handleDashboard = (r) => router.push(`/dashboard/${r ?? "customer"}`)

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <Spinner />
        </div>
      ) : (
        <>
          <Hero session={session} role={role} onSignIn={handleSignIn} onDashboard={handleDashboard} />

          <div className="max-w-7xl mx-auto px-6">
            {error && (
              <div role="alert" className="mb-6 rounded-md bg-red-900/60 border border-red-700 p-4 text-sm text-red-200">
                <strong className="font-semibold">Error</strong>
                <div className="mt-1">{error}</div>
              </div>
            )}
          </div>

          {!session ? (
            <>
              <PromoGrid />
              <section className="max-w-7xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-100 mb-4">Why Canna Logic</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300">Safety first</h3>
                    <p className="mt-2 text-gray-300 text-sm">Age verification and harm-reduction resources built into every flow.</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300">Community</h3>
                    <p className="mt-2 text-gray-300 text-sm">Workshops, local events, and educational content for responsible use.</p>
                  </div>
                  <div className="bg-gray-800 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-300">Compliance</h3>
                    <p className="mt-2 text-gray-300 text-sm">Built to meet RSA regulations and keep users informed.</p>
                  </div>
                </div>
              </section>
            </>
          ) : (
            <RoleHighlights role={role} />
          )}

          <footer className="border-t border-gray-800 mt-12 py-8">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-400 text-sm">© {new Date().getFullYear()} Canna Logic — Compliance first</div>
              <nav aria-label="Footer" className="flex gap-4">
                <a href="/privacy" className="text-gray-400 hover:text-green-300 text-sm">Privacy</a>
                <a href="/terms" className="text-gray-400 hover:text-green-300 text-sm">Terms</a>
                <a href="/contact" className="text-gray-400 hover:text-green-300 text-sm">Contact</a>
              </nav>
            </div>
          </footer>
        </>
      )}
    </main>
  )
}
