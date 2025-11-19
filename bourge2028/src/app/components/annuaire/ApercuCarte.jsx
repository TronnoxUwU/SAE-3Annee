"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/apercu_article.module.css";

export default function ApercuCarte({ article }) {
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  const title = article.titre || "Article sans titre";

  // ------------------------------
  // PRELOAD IMAGE (obligatoire)
  // ------------------------------
  async function preloadImage(url) {
    try {
      const img = new Image();
      img.src = url;

      const loaded = await new Promise((resolve, reject) => {
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

      if (loaded) {
        setImageSrc(url);
      }
    } catch {
      setImageSrc("/images/default-article.png");
    }
  }

  // ------------------------------
  // FETCH OG IMAGE depuis ton API
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
  // LOAD IMAGE PRINCIPALE
  // ------------------------------
  useEffect(() => {
    let canceled = false;

    async function loadImage() {
      // 1. Cherche og:image (Discord style)
      const og = await getOgImage(article.lienCarte);

      if (og && !canceled) {
        preloadImage(og);
        return;
      }

      // 2. Sinon → image interne
      preloadImage(originalSrc);
    }

    loadImage();
    return () => {
      canceled = true;
    };
  }, [article.lienCarte, originalSrc]);

  return (
    <a href={article.lienCarte}>
      <div className={styles.apercuArticle}>
        <img src={imageSrc} alt={title} className={styles.apercuArticleImage} />
        <h2>{title}</h2>
      </div>
    </a>
  );
}
