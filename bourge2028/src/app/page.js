"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/home.css";

const Map = dynamic(() => import("./components/Map/Map"), { ssr: false });
import Sidebar from './components/Sidebar/SidebarWrapper'
import Topbar from "@/components/Topbar.jsx";

export default function Page() {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState(null);

  // Filtres séparés
  const [contentFilter, setContentFilter] = useState({ categories: [], tags: [] }); // uniquement pour fetch articles
  const [geoFilter, setGeoFilter] = useState(null); // uniquement pour la carte

  const goToAnnuaire = () => {
    sessionStorage.setItem("fromHome", "true");
    router.push("/annuaire");
  };

  return (
    <main className="main-container">
      <Topbar fixed title="Carte de la culture à Bourges 2028 !" />

      <section className="section-map">
        <div className="map-wrapper">
          <div className="map-inner">
            <Sidebar
              map={mapInstance}
              onFilterChange={setContentFilter}   // categories/tags seulement
              onGeoFilterChange={setGeoFilter}    // position seulement
            />
            <Map
              mapFilter={geoFilter} // <--- uniquement géoloc
              onMapReady={setMapInstance}
            />
          </div>
        </div>
      </section>

      <button
        className="toggle-btn open"
        onClick={goToAnnuaire}
      >
        Aller à l’Annuaire ↓
      </button>
    </main>
  );
}
