"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Topbar from "../components/Topbar.jsx";
import "../styles/home.css";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });
const Annuaire = dynamic(() => import("../components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  const router = useRouter();
  const [drawerOpen, setDrawerOpen] = useState(true); // drawer ouvert par défaut
  const [animate, setAnimate] = useState(false);      // contrôle l'animation

  const handleToggleDrawer = () => {
    setAnimate(true);        // activer l'animation
    setDrawerOpen(!drawerOpen);
  };

  const handleClose = () => {
    setAnimate(true);        // animation lors de la fermeture
    setDrawerOpen(false);
    setTimeout(() => router.push("/", { shallow: true }), 600);
  };

  const drawerClass = drawerOpen ? "show" : "";
  const transitionClass = animate ? "" : "no-transition";

  return (
    <main className="main-container">
      <Topbar />
      <section className="section-map">
        <Sidebar map={null} onFilterChange={() => {}} />

        <div className="map-wrapper">
          <div className="map-inner">
            <Map mapFilter={null} onMapReady={() => {}} />
          </div>
        </div>

        <section className={`section-annuaire ${drawerClass} ${transitionClass}`}>
          <Annuaire mapFilter={null} />
        </section>

        <button
          className={`toggle-btn ${drawerOpen ? "closed" : "open"}`}
          onClick={handleToggleDrawer}
        >
          {drawerOpen ? "Revenir à la carte ↑" : "Aller à l’annuaire ↓"}
        </button>
      </section>
    </main>
  );
}
