"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./apercu_article.module.css";

export default function ApercuArticle({ article, editable, onDelete }) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  const title =
    article.titre?.length > 30
      ? article.titre.substring(0, 27) + "..."
      : article.titre || "Article sans titre";

  useEffect(() => {
    let canceled = false;

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

        if (!canceled) setImageSrc(url);
      } catch {
        if (!canceled) setImageSrc("/images/default-article.png");
      }
    }

    preloadImage(originalSrc);
    return () => {
      canceled = true;
    };
  }, [originalSrc]);

  const handleDelete = (e) => {
    e.stopPropagation();
    if (confirm("Supprimer cet article ?")) {
      onDelete(article.id);
    }
  };

  return (
    <div
      className={styles.apercuArticle}
      onClick={() => router.push(`/article/${article.id}`)}
    >
      {/* HEADER */}
      <header className={styles.header}>
        <h2
          className={styles.apercuArticleTitle}
          data-fulltitle={article.titre}
        >
          {title}
        </h2>

        {editable && (
          <div className={styles.actions}>
            <button
              className={styles.editButton}
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/article/${article.id}/edit`);
              }}
              aria-label="Éditer l’article"
            >
              <i className="bi bi-pencil" />
            </button>

            <button
              className={styles.deleteButton}
              onClick={handleDelete}
              aria-label="Supprimer l’article"
            >
              <i className="bi bi-trash" />
            </button>
          </div>
        )}
      </header>

      {/* CONTENU */}
      <div className={styles.content}>
        <img
          src={imageSrc}
          alt={title}
          className={styles.apercuArticleImage}
        />
      </div>
    </div>
  );
}
