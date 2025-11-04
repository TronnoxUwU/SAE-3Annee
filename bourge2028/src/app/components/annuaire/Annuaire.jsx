"use client";

import ApercuArticle from "./ApercuArticle";
import styles from "../../styles/annuaire.module.css";

export default function Annuaire({ articles }) {
  if (!articles?.length) {
    return <p>Aucun article trouvé.</p>;
  }

  return (
    <div className={styles.annuaire}>
      {articles.map((article) => (
        <ApercuArticle key={article.id} article={article} />
      ))}
    </div>
  );
}
