import "./globals.css"
import NavBar from "../components/NavBar"

export const metadata = {
  title: "Canna Logic Store",
  description: "Cannabis online store",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-zinc-50 dark:bg-black">
        <NavBar />
        {children}
      </body>
    </html>
  )
}
