"use client";

import { useEffect, useState } from "react";
import styles from "./apercu_article.module.css";

export default function ApercuCarte({ article }) {
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  const title = article.titre || "Article sans titre";

  // ------------------------------
  // PRELOAD IMAGE
  // ------------------------------
  async function preloadImage(url) {
    try {
      const img = new Image();
      img.src = url;

      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(), 4000);

        img.onload = () => {
          clearTimeout(timeout);
          resolve(true);
        };

        img.onerror = () => {
          clearTimeout(timeout);
          reject();
        };
      });

      setImageSrc(url);
    } catch {
      setImageSrc("/images/default-article.png");
    }
  }

  // ------------------------------
  // FETCH OG IMAGE
  // ------------------------------
  async function getOgImage(url) {
    try {
      const res = await fetch("/api/ogimage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      return data.image || null;
    } catch {
      return null;
    }
  }

  // ------------------------------
  // LOAD IMAGE
  // ------------------------------
  useEffect(() => {
    let canceled = false;

    async function loadImage() {
      const og = await getOgImage(article.lienCarte);

      if (og && !canceled) {
        preloadImage(og);
        return;
      }

      preloadImage(originalSrc);
    }

    loadImage();
    return () => {
      canceled = true;
    };
  }, [article.lienCarte, originalSrc]);

  return (
    <a
      href={article.lienCarte}
      className={styles.apercuArticle}
      target="_blank"
      rel="noopener noreferrer"
    >
      {/* HEADER */}
      <header className={styles.header}>
        <h2
          className={styles.apercuArticleTitle}
          data-fulltitle={article.titre}
        >
          {title}
        </h2>
      </header>

      {/* CONTENU */}
      <div className={styles.content}>
        <img
          src={imageSrc}
          alt={title}
          className={styles.apercuArticleImage}
        />
      </div>
    </a>
  );
}
