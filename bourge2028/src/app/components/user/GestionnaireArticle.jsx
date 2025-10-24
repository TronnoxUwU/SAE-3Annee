"use client";

import ApercuArticleEdit from "./ApercuArticleEdit";
import "../../styles/annuaire.css";

export default function Gestionnaire({ articles }) {
  if (!articles?.length) {
    return <p>Aucun article trouvé.</p>;
  }

  return (
    <div className="annuaire">
      {articles.map((article) => (
        <ApercuArticleEdit key={article.id} article={article} />
      ))}
    </div>
  );
}
