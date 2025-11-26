"use client";

import ApercuArticle from "./ApercuArticle";
import ApercuCarte from "./ApercuCarte";
import styles from "../../styles/annuaire.module.css";

export default function Annuaire({ articles }) {
  if (!articles?.length) {
    return <p>Aucun element trouvé.</p>;
  }
  if (articles[0].lienCarte) {
    return <div className={styles.annuaire}>
      {articles.map((article) => (
        <ApercuCarte key={article.id} article={article} />
      ))}
    </div>
  }
  return (
    <div className={styles.annuaire}>
      {articles.map((article) => (
        <ApercuArticle key={article.id} article={article} />
      ))}
    </div>
  );
}
