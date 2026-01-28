// /app/layout.js
import './globals.css'
import './layout.css'
import Link from 'next/link'
import Image from 'next/image'

export const metadata = {
  title: 'Canna Logic',
  description: 'Compliance-first cannabis platform — education, community, and commerce for RSA.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="root-layout">
        <header className="container site-nav" role="banner" aria-label="Top navigation">
          <div className="brand-and-toggle" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link href="/" className="brand" aria-label="Canna Logic home">
              {/* Replace with your logo in /public/logo.svg or similar */}
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <Image src="/logo.svg" alt="Canna Logic logo" width={36} height={36} priority />
                <span style={{ fontWeight: 800, color: 'var(--accent)' }}>Canna Logic</span>
              </span>
            </Link>
          </div>

          <nav className="nav-links" role="navigation" aria-label="Primary">
            <Link href="/learn" className="nav-link">Learn</Link>
            <Link href="/shop" className="nav-link">Shop</Link>
            <Link href="/events" className="nav-link">Events</Link>
            <Link href="/investor" className="nav-link">Investors</Link>
            <Link href="/docs" className="nav-link">Developers</Link>
          </nav>

          <div className="nav-actions" style={{ display: 'flex', gap: 8 }}>
            <Link href="/auth/signin" className="btn btn-ghost" aria-label="Sign in to Canna Logic">Sign in</Link>
            <Link href="/auth/register" className="btn btn-primary" aria-label="Register for Canna Logic">Get started</Link>
          </div>
        </header>

        <main className="main-content container" role="main">
          {children}
        </main>

        <footer className="site-footer container" role="contentinfo">
          <div className="footer-inner">
            <div className="footer-left">
              <div style={{ fontWeight: 700, color: 'var(--accent)' }}>Canna Logic</div>
              <div className="muted" style={{ marginTop: 6 }}>© {new Date().getFullYear()} Canna Logic — Compliance first</div>
            </div>

            <div className="footer-right" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <nav aria-label="Footer links" style={{ display: 'flex', gap: 12 }}>
                <Link href="/privacy" className="muted">Privacy</Link>
                <Link href="/terms" className="muted">Terms</Link>
                <Link href="/contact" className="muted">Contact</Link>
              </nav>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}
