"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "@/app/components/Sidebar/SidebarWrapper";
import "@/app/styles/home.css";

const Map = dynamic(() => import("@/app/components/Map/Map"), { ssr: false });
const Annuaire = dynamic(() => import("@/app/components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  const router = useRouter();

  // États UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);

  // États data
  const [catFilter, setCatFilter] = useState(null);
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

        let url = "/api/cartes";
        if (catFilter && catFilter.length > 0) {
          const params = new URLSearchParams();
          params.set(
            "cats",
            catFilter.map(c => c.id).join(",")
          );
          url += `?${params.toString()}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);

        const data = await res.json();
        setArticles(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger les cartes.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [catFilter]);

  const handleClose = () => {
    setAnimate(true);
    setDrawerOpen(false);
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <main className="main-container">
      <Topbar fixed />

      {/* Sidebar gère le filtre de la carte */}
      <Sidebar map={null} onFilterChange={setCatFilter} onGeoFilterChange={setGeoFilter} />

      {/* Carte principale */}
      <div className="map-wrapper">
        <div className="map-inner">
          <Map catFilter={geoFilter} onMapReady={() => { }} />
        </div>
      </div>

      {/* Annuaire latéral */}
      {mounted && (
        <section
          className={`section-annuaire ${drawerOpen ? "show" : ""} ${animate ? "" : "no-transition"
            }`}
        >
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <Annuaire articles={articles} />
          )}
        </section>
      )}

      {/* Bouton de bascule carte/annuaires/projets */}
      <button
        className={`toggle-btn ${drawerOpen ? "closed" : "open"} ${animate ? "" : "no-transition"
          }`}
        onClick={handleClose}
      >
        {drawerOpen ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
      </button>

      <button
        className = "btn-ajout-map"
        onClick={() => router.push('/annuaires/cartes/proposition')}
      >
        +
      </button>
    </main>
  );
}
