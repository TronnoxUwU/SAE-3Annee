"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import "./styles/home.css";

const Map = dynamic(() => import("./components/Map"), { ssr: false });
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });
const Annuaire = dynamic(() => import("./components/Annuaire"), { ssr: false });

export default function Page() {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapFilter, setMapFilter] = useState(null);
  const [showAnnuaire, setShowAnnuaire] = useState(false);
  const [mapVisible, setMapVisible] = useState(true);

  const TRANSITION_DURATION = 600; // doit correspondre à la durée CSS

  const handleToggleView = () => {
    if (!showAnnuaire) {
      // Faire glisser l'annuaire vers le haut
      setShowAnnuaire(true);

      // Après la transition CSS, décharger la map
      setTimeout(() => setMapVisible(false), TRANSITION_DURATION);
    } else {
      // Revenir à la carte
      setMapVisible(true);
      setShowAnnuaire(false);
    }
  };

  return (
    <main className="main-container">
      <section className="section-map">
        <Sidebar map={mapInstance} onFilterChange={setMapFilter} />

        {/* --- MAP --- */}
        <div className="map-wrapper">
          <div
            className="map-inner"
            style={{
              opacity: mapVisible ? 1 : 0,
              pointerEvents: mapVisible ? "auto" : "none",
            }}
          >
            <Map mapFilter={mapFilter} onMapReady={setMapInstance} />
          </div>
        </div>

        {/* --- ANNUAIRE --- */}
        <section className={`section-annuaire ${showAnnuaire ? "show" : ""}`}>
          <Annuaire mapFilter={mapFilter} />
        </section>
      </section>

      {/* --- BOUTON FLOTTANT --- */}
      <button
        className={`toggle-btn ${showAnnuaire ? "top" : "bottom"}`}
        onClick={handleToggleView}
      >
        {showAnnuaire ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
      </button>
    </main>
  );
}
