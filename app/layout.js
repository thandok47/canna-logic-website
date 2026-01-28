// app/layout.js
import "./globals.css"
import Link from "next/link"
import { AuthProvider } from "../components/AuthProvider"

export const metadata = {
  title: "Canna Logic",
  description: "Compliance-friendly cannabis industry platform",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <AuthProvider>
          {/* Global header */}
          <header className="w-full border-b bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.svg" alt="Canna Logic" className="h-8 w-auto" />
                    <span className="font-semibold tracking-wide">CANNA LOGIC</span>
                  </Link>
                </div>

                <nav className="flex items-center gap-4">
                  <Link href="/" className="text-sm font-medium hover:underline">
                    Home
                  </Link>
                  <Link href="/learn" className="text-sm font-medium hover:underline">
                    Learn
                  </Link>
                  <Link href="/shop" className="text-sm font-medium hover:underline">
                    Shop
                  </Link>
                  <Link href="/events" className="text-sm font-medium hover:underline">
                    Events
                  </Link>
                  <Link href="/docs" className="text-sm font-medium hover:underline">
                    Docs
                  </Link>

                  {/* Auth actions (static placeholders). Replace with a client-side component that reads session for dynamic behavior. */}
                  <Link
                    href="/auth/signin"
                    className="rounded-md px-3 py-1 text-sm font-medium hover:bg-slate-100"
                  >
                    Sign in
                  </Link>
                  <Link
                    href="/auth/register"
                    className="ml-2 inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-sm font-semibold text-white hover:bg-green-700"
                  >
                    Get started
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          {/* App content */}
          <main className="min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
