"use client";

import { useEffect, useState } from "react";

/**
 * Composant d'image avec préchargement, timeout et fallback automatique.
 * Si l'image met trop longtemps à se charger ou échoue, elle affiche une image par défaut.
 */
export default function ArticleImage({ src, alt = "", className = "", timeout = 4000 }) {
  const [imgSrc, setImgSrc] = useState("/images/default-article.png");

  useEffect(() => {
    let canceled = false;

    if (!src) {
      setImgSrc("/images/default-article.png");
      return;
    }

    const img = new Image();
    const timer = setTimeout(() => {
      if (!canceled) setImgSrc("/images/default-article.png");
    }, timeout);

    img.onload = () => {
      clearTimeout(timer);
      if (!canceled) setImgSrc(src);
    };

    img.onerror = () => {
      clearTimeout(timer);
      if (!canceled) setImgSrc("/images/default-article.png");
    };

    img.src = src;

    return () => {
      canceled = true;
      clearTimeout(timer);
    };
  }, [src, timeout]);

  return <img src={imgSrc} alt={alt} className={className} />;
}
