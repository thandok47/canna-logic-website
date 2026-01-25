import Link from "next/link"

export default function NavBar() {
  return (
    <nav className="flex gap-6 p-4 bg-green-900 text-white">
      <Link href="/">Home</Link>
      <Link href="/products">Products</Link>
      <Link href="/about">About</Link>
      <Link href="/contact">Contact</Link>
      <Link href="/affiliates">Affiliates</Link>
      <Link href="/kiosks">Kiosks</Link>
      <Link href="/cafe">Cafe</Link>
    </nav>
  )
}
