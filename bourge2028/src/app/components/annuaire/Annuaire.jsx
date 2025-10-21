"use client";

import { useEffect, useState } from "react";
import ApercuArticle from "./ApercuArticle";
import "../../styles/annuaire.css";

export default function Annuaire() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await fetch("/api/articles");
        if (!res.ok) {
          throw new Error(`Erreur ${res.status}`);
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les articles.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!articles.length) return <p>Aucun article trouvé.</p>;

  return (
    <div className="annuaire">
      {articles.map((article) => (
        <ApercuArticle key={article.id} article={article} />
      ))}
    </div>
  );
}
