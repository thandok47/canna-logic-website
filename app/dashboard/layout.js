"use client"

import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { useAuth } from "@/components/AuthProvider"
import { useEffect, useState } from "react"

export default function DashboardLayout({ children }) {
  const { session } = useAuth()
  const [role, setRole] = useState(null)

  useEffect(() => {
    const fetchRole = async () => {
      if (session?.user) {
        const { data, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()
        if (!error && data) setRole(data.role)
      }
    }
    fetchRole()
  }, [session])

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 text-xl font-bold border-b border-gray-700">
          Canna Logic
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="block hover:bg-gray-800 p-2 rounded">
            Home
          </Link>

          {/* Role-specific links */}
          {role === "admin" && (
            <>
              <Link href="/dashboard/admin/users" className="block hover:bg-gray-800 p-2 rounded">
                User Management
              </Link>
              <Link href="/dashboard/admin/logs" className="block hover:bg-gray-800 p-2 rounded">
                Audit Logs
              </Link>
            </>
          )}

          {role === "customer" && (
            <>
              <Link href="/dashboard/customer/orders" className="block hover:bg-gray-800 p-2 rounded">
                My Orders
              </Link>
              <Link href="/dashboard/customer/support" className="block hover:bg-gray-800 p-2 rounded">
                Support
              </Link>
            </>
          )}

          {role === "investor" && (
            <>
              <Link href="/dashboard/investor/reports" className="block hover:bg-gray-800 p-2 rounded">
                Reports
              </Link>
              <Link href="/dashboard/investor/opportunities" className="block hover:bg-gray-800 p-2 rounded">
                Opportunities
              </Link>
            </>
          )}

          {role === "staff" && (
            <>
              <Link href="/dashboard/staff/tasks" className="block hover:bg-gray-800 p-2 rounded">
                Tasks
              </Link>
              <Link href="/dashboard/staff/schedule" className="block hover:bg-gray-800 p-2 rounded">
                Schedule
              </Link>
            </>
          )}

          {role === "student" && (
            <>
              <Link href="/dashboard/student/courses" className="block hover:bg-gray-800 p-2 rounded">
                My Courses
              </Link>
              <Link href="/dashboard/student/progress" className="block hover:bg-gray-800 p-2 rounded">
                Progress
              </Link>
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => supabase.auth.signOut()}
            className="w-full bg-red-600 hover:bg-red-700 py-2 rounded"
          >
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 bg-gray-50">
        <header className="p-4 border-b bg-white shadow">
          <h1 className="text-2xl font-semibold">
            {session?.user?.email || "Dashboard"}
          </h1>
        </header>
        <section className="p-6">{children}</section>
      </main>
    </div>
  )
}
