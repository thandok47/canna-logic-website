// components/Header.tsx
"use client";
import Link from "next/link";

export default function Header(){
  return (
    <header style={{background: "var(--blue-deep)", color: "var(--text)"}}>
      <nav className="nav">
        <Link href="/"><a className="nav-link">Home</a></Link>
        <Link href="/about"><a className="nav-link">About</a></Link>
      </nav>
    </header>
  );
}

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
