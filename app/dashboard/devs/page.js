// /app/dashboard/devs/page.js
export const metadata = {
  title: "Developer Sandbox - Canna Logic",
  description: "Developer tools, API keys, and sandbox environment",
}

export default async function DevsDashboardPage() {
  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Developer Sandbox</h1>
        <p className="lead">API docs, test keys, and integration guides.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">API Keys</h3>
          <p className="muted">Manage test keys and rotate credentials safely.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Sandbox Logs</h3>
          <p className="muted">Request/response logs for debugging integrations.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Docs</h3>
          <p className="muted">Quick links to API reference and SDK examples.</p>
        </div>
      </section>
    </main>
  )
}
