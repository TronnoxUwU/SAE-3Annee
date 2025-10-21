"use client"; // obligatoire pour utiliser useRouter

import { useRouter } from "next/navigation";
import "../../styles/apercu_article.css";

export default function ApercuArticle({ article }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/article/${article.id}`);
  };

  return (
    <div className="apercu-article" onClick={handleClick}>
      <img src={article.image} alt={article.title} />
      <h2>{article.title}</h2>
    </div>
  );
}
