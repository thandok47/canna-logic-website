// /app/dashboard/executives/page.js
export const metadata = {
  title: "Executive Dashboard - Canna Logic",
  description: "High-level KPIs, financial snapshot, and compliance overview",
}

export default async function ExecutivesDashboardPage() {
  // Server-side: fetch KPIs or summaries as needed
  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Executive Overview</h1>
        <p className="lead">High-level KPIs, financial snapshot, and compliance status.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Financial Snapshot</h3>
          <p className="muted">Revenue, margins, and recent trends.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Compliance Summary</h3>
          <p className="muted">Open issues, audit readiness, and regulatory status.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Strategic Notes</h3>
          <p className="muted">Recent board items and strategic initiatives.</p>
        </div>
      </section>
    </main>
  )
}
