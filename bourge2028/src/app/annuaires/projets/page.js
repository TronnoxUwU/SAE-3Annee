"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import Sidebar from "@/app/components/Sidebar/SidebarWrapper";
import "@/app/styles/home.css";

const Map = dynamic(() => import("@/app/components/Map/Map"), { ssr: false });
const Annuaire = dynamic(() => import("@/components/annuaire/Annuaire"), { ssr: false });

// Composant interne qui utilise useSearchParams
function AnnuaireContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // États UI
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false);

  // États data
  const [mapInstance, setMapInstance] = useState(null);
  const [depFilter, setDepFilter] = useState([]);
  const [catFilter, setCatFilter] = useState({ categories: [] });
  const [searchStruct, setSearchStruct] = useState(""); 

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const searchFromUrl = searchParams.get("search");

    if (searchFromUrl) {
      setSearchStruct(searchFromUrl);
    }
  }, [searchParams]);

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

        const params = new URLSearchParams();

        if (catFilter?.length > 0) {
          params.set("cats", catFilter.map(c => c.id).join(","));
        }

        if (depFilter?.length > 0) {
          params.set("deps", depFilter.map(d => d.id).join(","));
        }

        if (searchStruct && searchStruct.trim() !== "") {
          params.set("search", searchStruct.trim());
        }

        const url = params.toString().length > 0
          ? `/api/projets?${params.toString()}`
          : "/api/projets";

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
  }, [catFilter, depFilter, searchStruct]);

  const handleClose = () => {
    setAnimate(true);
    setDrawerOpen(false);
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <main className="main-container">
      <Topbar fixed />

      {/* Sidebar gère le filtre de la carte */}
      <Sidebar
        map={mapInstance}
        onFilterChange={setCatFilter}
        onDepFilterChange={setDepFilter}
        onSearchStructChange={setSearchStruct}
        isAnnuaire={true}
      />
      {/* Carte principale */}
      <div className="map-wrapper">
        <div className="map-inner">
          <Map
            depFilter={depFilter}
            catFilter={catFilter}
            onMapReady={setMapInstance}
          />
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
        {drawerOpen ? "Revenir à la carte ↑" : "Aller à l'Annuaire ↓"}
      </button>
    </main>
  );
}

// Composant principal avec Suspense
export default function AnnuairePage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <AnnuaireContent />
    </Suspense>
  );
}