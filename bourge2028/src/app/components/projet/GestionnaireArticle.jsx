"use client";

import ApercuArticleEdit from "./ApercuArticleEdit";
import styles from "../../styles/annuaire.module.css";

export default function Gestionnaire({ articles }) {
  if (!articles?.length) {
    return <p>Aucun article trouvé.</p>;
  }

  return (
    <div className={styles.annuaire}>
      {articles.map((article) => (
        <ApercuArticleEdit key={article.id} article={article} />
      ))}
    </div>
  );
}
