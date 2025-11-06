"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "../../components/Sidebar/SidebarWrapper";
import "../../styles/projets.module.css";

const GestionnaireArticle = dynamic(() => import("../../components/user/GestionnaireArticle"), { ssr: false });

export default function ProjetsPage() {

    // États data
    const [mapFilter, setMapFilter] = useState(null);
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    // 🔹 Récupération des articles (c’est ici que la requête est faite)
    useEffect(() => {
        async function fetchArticles() {
            try {
                setLoading(true);
                setError(null);

                let url = "/api/articles"; // api/user/articles
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
        return () => {
            window.location.href = `/user/projets/${article.id}/edit`;
        };
    };

    return (
        <main className="main-container">
            <Topbar fixed />

  // 🔹 Log des changements de filtres
  useEffect(() => {
    if (mapFilter) {
      console.log("Filtres mis à jour :", mapFilter);
    }
  }, [mapFilter]);

  const handleClose = () => {
    setAnimate(true);
    setDrawerOpen(false);
    setTimeout(() => router.push("/"), 600);
  };

            {/* 🔸 Sidebar gère le filtre de la carte */}
            <Sidebar map={null} onFilterChange={setMapFilter} />

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

