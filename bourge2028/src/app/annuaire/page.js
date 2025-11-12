"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "../components/Sidebar/SidebarWrapper";
import "../styles/home.css";

const Map = dynamic(() => import("../components/Map/Map"), { ssr: false });
const Annuaire = dynamic(() => import("../components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  const router = useRouter();

  // États UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);

  // États data
  const [mapFilter, setMapFilter] = useState(null);
  const [geoFilter, setGeoFilter] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation du panneau latéral (drawer)
  useEffect(() => {
    const fromHome = sessionStorage.getItem("fromHome");
    if (fromHome === "true") {
      setAnimate(true);
      setDrawerOpen(false);
      setMounted(true);

      requestAnimationFrame(() => {
        sessionStorage.removeItem("fromHome");
        setDrawerOpen(true);
      });
    } else {
      setAnimate(false);
      setDrawerOpen(true);
      setMounted(true);
    }
  }, []);

  // 🔹 Récupération des articles
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

  return (
    <main className="main-container">
      <Topbar fixed />

      {/* Sidebar gère le filtre de la carte */}
      <Sidebar map={null} onFilterChange={setMapFilter} onGeoFilterChange={setGeoFilter} />

      {/* Carte principale */}
      <div className="map-wrapper">
        <div className="map-inner">
          <Map mapFilter={geoFilter} onMapReady={() => { }} />
        </div>
      </div>

      {/* Annuaire latéral */}
      {mounted && (
        <section
          className={`section-annuaire ${drawerOpen ? "show" : ""} ${animate ? "" : "no-transition"
            }`}
        >
          {loading ? (
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement des données...</p>
            </div>
          </div>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Annuaire articles={articles} />
          )}
        </section>
      )}

      {/* Bouton de bascule carte/annuaire */}
      <button
        className={`toggle-btn ${drawerOpen ? "closed" : "open"} ${animate ? "" : "no-transition"
          }`}
        onClick={handleClose}
      >
        {drawerOpen ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
      </button>
    </main>
  );
}
