// components/Card.tsx
"use client";

import React from "react";
import styles from "./Card.module.css";

type CardProps = {
  title: string;
  description?: string;
  tag?: string;
  imageUrl?: string;
  ctaText?: string;
  onCta?: () => void;
};

export default function Card({
  title,
  description,
  tag,
  imageUrl,
  ctaText = "Learn more",
  onCta,
}: CardProps): React.ReactElement {
  return (
    <article className={styles.card} role="article" aria-label={title}>
      {imageUrl ? (
        <div
          className={styles.media}
          style={{ backgroundImage: `linear-gradient(135deg, var(--blue-deep), var(--blue-mid)), url(${imageUrl})` }}
          aria-hidden="true"
        />
      ) : (
        <div className={styles.mediaPlaceholder} aria-hidden="true" />
      )}

      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>

        {description && <p className={styles.description}>{description}</p>}

        <div className={styles.actions}>
          <button
            className={styles.cta}
            onClick={onCta}
            type="button"
            aria-label={`${ctaText} for ${title}`}
          >
            {ctaText}
          </button>
        </div>
      </div>
    </article>
  );
}
