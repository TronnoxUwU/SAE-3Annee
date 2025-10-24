"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "../../components/Sidebar/SidebarWrapper";
import "../../styles/projets.css";

const GestionnaireArticle = dynamic(
  () => import("../../components/user/GestionnaireArticle"),
  { ssr: false }
);

export default function ProjetsPage() {
  const [mapFilter, setMapFilter] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArticles() {
      try {
        setLoading(true);
        setError(null);

        let url = "/api/articles";
        if (mapFilter) {
          const params = new URLSearchParams(mapFilter).toString();
          url += `?${params}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);

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
  }, [mapFilter]);

  // 🔹 Calcul du prochain ID
  const getNextArticleId = () => {
    if (!articles || articles.length === 0) return 1;
    const lastId = Math.max(...articles.map((a) => a.id || 0));
    return lastId + 1;
  };

  const handleCreate = () => {
    const nextId = getNextArticleId();
    window.location.href = `/user/projets/${nextId}/edit`;
  };

  return (
    <main className="main-container">
      <Topbar fixed />

      {/* 🔸 Bouton d'ajout de projet/article */}
      <button className="btn-add" onClick={handleCreate}>+</button>

      {/* 🔸 Sidebar gère le filtre de la carte */}
      <Sidebar map={null} onFilterChange={setMapFilter} />

      {/* 🔸 Articles latéraux */}
      <section className="section-articles">
        <GestionnaireArticle articles={articles} />
      </section>
    </main>
  );
}
