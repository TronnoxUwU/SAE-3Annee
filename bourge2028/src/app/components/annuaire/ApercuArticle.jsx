"use client"; // obligatoire pour utiliser useRouter

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/apercu_article.css";

export default function ApercuArticle({ article }) {
  const router = useRouter();
  const [imageSrc, setImageSrc] = useState("/images/default-article.png");

  const handleClick = () => {
    router.push(`/article/${article.id}`);
  };

  // 🔹 Cherche le premier composant de type "image"
  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  const originalSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  const title = article.titre || "Article sans titre";

  // 🔹 Prétéléchargement de l’image
  useEffect(() => {
    let canceled = false;

    async function preloadImage(url) {
      try {
        const img = new Image();
        img.src = url;

        const result = await new Promise((resolve, reject) => {
          const timeout = setTimeout(
            () => reject(new Error("Timeout de chargement")),
            4000 // 4 secondes max avant fallback
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

        if (!canceled && result) {
          setImageSrc(url);
        }
      } catch {
        if (!canceled) {
          setImageSrc("/images/default-article.png");
        }
      }
    }

    preloadImage(originalSrc);

    return () => {
      canceled = true;
    };
  }, [originalSrc]);

  return (
    <div className="apercu-article" onClick={handleClick}>
      <img
        src={imageSrc}
        alt={title}
        className="apercu-article-image"
        onError={(e) => {
          if (!e.target.src.endsWith("default-article.png")) {
            e.target.src = "/images/default-article.png";
          }
        }}
      />
      <h2>{title}</h2>
    </div>
  );
}
