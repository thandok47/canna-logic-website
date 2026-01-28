// /app/dashboard/staff/page.js
export const metadata = {
  title: "Staff Dashboard - Canna Logic",
  description: "Shift schedules, inventory alerts, and staff notices",
}

export default async function StaffDashboardPage() {
  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Staff Quick View</h1>
        <p className="lead">Shift schedules, inventory alerts, and internal notices.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Shift Schedule</h3>
          <p className="muted">Your upcoming shifts and swap requests.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Inventory Alerts</h3>
          <p className="muted">Low stock items and restock ETA.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Notices</h3>
          <p className="muted">Internal announcements and policy updates.</p>
        </div>
      </section>
    </main>
  )
}
