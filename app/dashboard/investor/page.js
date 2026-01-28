// /app/dashboard/investor/page.js
export const metadata = {
  title: "Investor Dashboard - Canna Logic",
  description: "Investor reports, performance metrics, and documents",
}

export default async function InvestorDashboardPage() {
  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Investor Portal</h1>
        <p className="lead">Reports, performance metrics, and investor documents.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Quarterly Reports</h3>
          <p className="muted">Latest financials and downloadable reports.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Performance Metrics</h3>
          <p className="muted">Key metrics and growth indicators.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Investor Relations</h3>
          <p className="muted">Contact and upcoming investor events.</p>
        </div>
      </section>
    </main>
  )
}
