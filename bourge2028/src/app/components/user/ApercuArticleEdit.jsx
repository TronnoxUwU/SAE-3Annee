"use client"; // obligatoire pour utiliser useRouter

import { useRouter } from "next/navigation";
import "../../styles/apercu_article.css";

export default function ApercuArticle({ article }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/user/article/${article.id}/edit`);
  };

  // Cherche le premier composant de type "image"
  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  // Source de l’image principale
  const imageSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.png";

  // Titre de secours
  const title = article.titre || "Article sans titre";

  // Fonction appelée quand l’image échoue à charger
  const handleImageError = (e) => {
    e.target.src = "/images/default-article.png";
  };

  return (
    <div className="apercu-article" onClick={handleClick}>
      <img
        src={imageSrc}
        alt={title}
        className="apercu-article-image"
        onError={handleImageError}
      />
      <h2>{title}</h2>
    </div>
  );
}
