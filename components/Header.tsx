// components/Header.tsx
"use client";

import React from "react";
// If NavBar.tsx is in the same folder, use "./NavBar"
import NavBar from "./NavBar";
// If you use tsconfig paths (baseUrl + paths), you could use:
// import NavBar from "@/components/NavBar";

import styles from "./Header.module.css";

export default function Header(): React.ReactElement {
  return (
    <header className={styles.header ?? ""}>
      <div className={styles.brand ?? ""}>
        <a href="/" className={styles.logo ?? ""} aria-label="CannaLogic home">
          <span className={styles.logoMark ?? ""} aria-hidden="true" />
          <span className={styles.logoText ?? ""}>CannaLogic</span>
        </a>
      </div>

      <NavBar />

      <div className={styles.tools ?? ""}>
        <button className={styles.iconBtn ?? ""} aria-label="Search">🔍</button>
        <button className={styles.cta ?? ""} aria-label="Sign in">Sign in</button>
      </div>
    </header>
  );
}
