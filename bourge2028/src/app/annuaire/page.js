"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import "../styles/home.css";

const Map = dynamic(() => import("../components/Map/Map"), { ssr: false });
const Sidebar = dynamic(() => import("../components/Sidebar/Sidebar"), { ssr: false });
const Annuaire = dynamic(() => import("../components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  const router = useRouter();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [mounted, setMounted] = useState(false); // état pour forcer rendu initial

  useEffect(() => {
    const fromHome = sessionStorage.getItem("fromHome");
    if (fromHome === "true") {
      setAnimate(true);      // activer transition
      setDrawerOpen(false);  // commence fermé
      setMounted(true);      // monter le drawer dans le DOM

      // déclencher l'ouverture dans le tick suivant
      requestAnimationFrame(() => {
        sessionStorage.removeItem("fromHome");
        setDrawerOpen(true); // déclenche la transition
      });
    } else {
      // rechargement direct → ouverture immédiate sans transition
      setAnimate(false);
      setDrawerOpen(true);
      setMounted(true);
    }
  }, []);

  const handleClose = () => {
    setAnimate(true);
    setDrawerOpen(false);
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <main className="main-container">
      <Topbar />
      <section className="section-map">
        <Sidebar map={null} onFilterChange={() => { }} />

        <div className="map-wrapper">
          <div className="map-inner">
            <Map mapFilter={null} onMapReady={() => { }} />
          </div>
        </div>

        {mounted && (
          <section className={`section-annuaire ${drawerOpen ? "show" : ""} ${animate ? "" : "no-transition"}`}>
            <Annuaire mapFilter={null} />
          </section>
        )}

        <button
          className={`toggle-btn ${drawerOpen ? "closed" : "open"} ${animate ? "" : "no-transition"}`}
          onClick={handleClose}
        >
          {drawerOpen ? "Revenir à la carte ↑" : "Aller à l’annuaire ↓"}
        </button>
      </section>
    </main>
  );
}
