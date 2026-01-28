// /app/dashboard/admin/page.js
export const metadata = {
  title: "Admin Dashboard - Canna Logic",
  description: "Administrative overview for Canna Logic",
}

export default async function AdminDashboardPage() {
  // Server-safe: do not use browser APIs here.
  // Optionally fetch server-side data:
  // const res = await fetch(`${process.env.API_URL}/admin/summary`);
  // const summary = await res.json();

  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Admin Dashboard</h1>
        <p className="lead">Overview, compliance logs, and user management tools.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Site Health</h3>
          <p className="muted">Uptime, recent builds, and system alerts.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Compliance Logs</h3>
          <p className="muted">Recent compliance events, audits, and reports.</p>
        </div>

        <div className="card">
          <h3 className="kicker">User Management</h3>
          <p className="muted">Manage roles, access, and account status.</p>
        </div>
      </section>
    </main>
  )
}
