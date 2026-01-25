"use client"; // only if Header uses hooks or client-only features

import React from "react";
import NavBar from "./NavBar";
import styles from "./Header.module.css";

export default function Header(): React.ReactElement {
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <a href="/" className={styles.logo}>CannaLogic</a>
      </div>
      <NavBar />
      <div className={styles.tools}>
        {/* search, auth buttons, etc. */}
      </div>
    </header>
  );
}
