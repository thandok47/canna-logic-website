// /app/dashboard/student/page.js
export const metadata = {
  title: "Student Dashboard - Canna Logic",
  description: "Learning modules, workshop signups, and progress tracking",
}

export default async function StudentDashboardPage() {
  return (
    <main className="min-h-screen container">
      <header className="mb-6">
        <h1 className="h1">Learning Hub</h1>
        <p className="lead">Workshops, harm-reduction modules, and progress tracking.</p>
      </header>

      <section className="grid-3">
        <div className="card">
          <h3 className="kicker">Current Courses</h3>
          <p className="muted">Modules you are enrolled in and completion status.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Upcoming Workshops</h3>
          <p className="muted">Sign up for local and online sessions.</p>
        </div>

        <div className="card">
          <h3 className="kicker">Certificates</h3>
          <p className="muted">Downloadable certificates and learning history.</p>
        </div>
      </section>
    </main>
  )
}
