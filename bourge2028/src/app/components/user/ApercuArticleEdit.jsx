"use client"; // obligatoire pour utiliser useRouter

import { useRouter } from "next/navigation";
import "../../styles/apercu_article.css";

export default function ApercuArticle({ article }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/article/${article.id}`); // user/article/${article.id}/edit
  };

  // 🔹 Cherche le premier composant de type "image"
  const firstImageComponent = article.composants?.find(
    (elt) => elt.type === "image"
  );

  // 🔹 Si trouvé, récupère son lien, sinon image par défaut
  const imageSrc =
    firstImageComponent?.image?.lienImage || "/images/default-article.jpg";

  // 🔹 Utilise aussi le titre de l’article ou un fallback
  const title = article.titre || "Article sans titre";

  return (
    <div className="apercu-article" onClick={handleClick}>
      <img src={imageSrc} alt={title} className="apercu-article-image" />
      <h2>{title}</h2>
    </div>
  );
}
