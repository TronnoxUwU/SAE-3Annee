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

  const TRANSITION_DURATION = 600; // correspond à la durée CSS de l'annuaire

  const handleToggleView = () => {
    if (!showAnnuaire) {
      // Faire glisser l'annuaire par-dessus la map
      setShowAnnuaire(true);

      // Après la transition CSS (0.6s), décharger la map
      setTimeout(() => {
        setMapVisible(false);
      }, 600);
    } else {
      // Revenir à la map : afficher map + faire redescendre l'annuaire
      setMapVisible(true);
      setShowAnnuaire(false);
    }
  };


  return (
    <main className="main-container">
      {/* Section map */}
      <section className="section-map">
        <Sidebar map={mapInstance} onFilterChange={setMapFilter} />

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

          {/* Overlay blanche si map est déchargée */}
          {!mapVisible && <div className="map-overlay"></div>}
        </div>

        {/* Annuaire superposé */}
        <section className={`section-annuaire ${showAnnuaire ? "show" : ""}`}>
          <Annuaire mapFilter={mapFilter} />
        </section>
      </section>

      {/* Bouton flottant */}
      <button
        className={`toggle-btn ${showAnnuaire ? "top" : "bottom"}`}
        onClick={handleToggleView}
      >
        {showAnnuaire ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
      </button>
    </main>
  );
}
