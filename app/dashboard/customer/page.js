// /app/dashboard/customer/page.js
export const metadata = {
  title: "Customer Dashboard - Canna Logic",
  description: "Customer quick access to orders, favorites, and support",
}

export default async function CustomerDashboardPage() {
  // Example server-side fetch placeholder:
  // const orders = await fetchOrdersForUser(userId)

  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Your Dashboard</h1>
        <p className="lead">Quick access to orders, saved products, and support.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Recent Orders</h3>
          <p className="muted">Track shipments and view order history.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Saved Items</h3>
          <p className="muted">Your favorites and recommended products.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Support</h3>
          <p className="muted">Open tickets and help resources.</p>
        </div>
      </section>
    </main>
  )
}
