// components/NavBar.tsx
"use client";
import Link from "next/link";
import React from "react";

export default function NavBar(): React.ReactElement {
  return (
    <nav aria-label="Primary navigation">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </nav>
  );
}
