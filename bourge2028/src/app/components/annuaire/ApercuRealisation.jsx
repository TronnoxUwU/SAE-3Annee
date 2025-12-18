"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/apercu_article.module.css";

export default function ApercuRealisation({ article, editable, onDelete }) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  const title =
    article.nomProjet?.length > 30
      ? article.nomProjet.substring(0, 27) + "..."
      : article.nomProjet || "Projet sans titre";

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

    if (confirm("Supprimer ce projet ?")) {
      onDelete(article.id);
    }
  };

  console.log(editable)

  return (
    <div
      className={styles.apercuArticle}
      onClick={() =>
        router.push(`/annuaires/projets/${article.id}`)
      }
    >
      {editable && (
        <div className={styles.actions}>
          <button
            className={styles.editButton}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/annuaires/projets/${article.id}/edit`);
            }}
            aria-label="Éditer le projet"
          >
            <i className="bi bi-pencil" />
          </button>

          <button
            className={styles.deleteButton}
            onClick={handleDelete}
            aria-label="Supprimer le projet"
          >
            <i className="bi bi-trash" />
          </button>
        </div>
      )}

      <img
        src={imageSrc}
        alt={title}
        className={styles.apercuArticleImage}
      />

      <h2
        className={styles.apercuArticleTitle}
        data-fulltitle={article.nomProjet}
      >
        {title}
      </h2>
    </div>
  );
}
