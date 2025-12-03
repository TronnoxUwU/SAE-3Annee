"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/apercu_article.module.css";

export default function ApercuRealisation({ article }) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  console.log(article)

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

        const result = await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Timeout de chargement")),
            4000
          );
          img.onload = () => {
            clearTimeout(timeout);
            resolve(true);
          };
          img.onerror = () => {
            clearTimeout(timeout);
            reject(new Error("Erreur de chargement"));
          };
        });

        

        if (!canceled && result) setImageSrc(url);
      } catch {
        if (!canceled) setImageSrc("/images/default-article.png");
      }
    }

    preloadImage(originalSrc);
    return () => {
      canceled = true;
    };
  }, [originalSrc]);

  return (
    <div className={styles.apercuArticle} onClick={() => router.push(`/annuaires/projets/${article.id}`)}>
      <img src={imageSrc} alt={title} className={styles.apercuArticleImage} />
      <h2 className={styles.apercuArticleTitle} data-fulltitle={article.apercuArticle}>
        {title}
      </h2>
    </div>
  );
}
