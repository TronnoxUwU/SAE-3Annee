"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "../../components/Sidebar/SidebarWrapper";
import styles from "../../styles/projets.module.css";

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

  const handleCreate = () => {
    // le bouton doit rediriger vers la création, pas vers un article inexistant
    window.location.href = `/structure/projets/new`;
  };

  return (
    <main className="main-container">
      <Topbar fixed />

      {/* Bouton d'ajout de projet/article */}

      <a className={styles.btnAddWrapper} href="/articles">
        <button className={styles.btnAdd}>
          +
        </button>
      </a>

      <Sidebar map={null} onFilterChange={setMapFilter} />

      <section className="section-articles">
        <GestionnaireArticle articles={articles} />
      </section>
    </main>
  );
}
