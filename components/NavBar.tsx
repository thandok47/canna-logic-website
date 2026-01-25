// components/NavBar.tsx
"use client";

import Link from "next/link";
import React from "react";
import styles from "./NavBar.module.css"; // optional: create a module or remove if not used

export default function NavBar(): React.ReactElement {
  return (
    <nav className={styles.nav ?? "nav"}>
      <ul className={styles.list ?? "nav-list"}>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/products">Products</Link></li>
        <li><Link href="/about">About</Link></li>
        <li><Link href="/contact">Contact</Link></li>
        <li><Link href="/affiliates">Affiliates</Link></li>
        <li><Link href="/kiosks">Kiosks</Link></li>
        <li><Link href="/cafe">Cafe</Link></li>
      </ul>
    </nav>
  );
}
