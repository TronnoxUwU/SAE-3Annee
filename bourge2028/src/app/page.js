"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/home.css";

const Map = dynamic(() => import("./components/Map/Map"), { ssr: false });
// const Sidebar = dynamic(() => import("./components/SidebarWrapper"), { ssr: false });
import Sidebar from './components/Sidebar/SidebarWrapper'
import Topbar from "@/components/Topbar.jsx";



export default function Page() {
  const router = useRouter();
  const [mapInstance, setMapInstance] = useState(null);
  const [mapFilter, setMapFilter] = useState(null);

  const goToAnnuaire = () => {
    router.push("/annuaire"); // juste naviguer, animation gérée côté /annuaire
  };

  return (
    <main className="main-container">
      <section className="section-map">
        

        <div className="map-wrapper">
          <div className="map-inner">
            <Sidebar map={mapInstance} onFilterChange={setMapFilter} />
            <Map mapFilter={mapFilter} onMapReady={setMapInstance} />
            <Topbar fixed title="Carte de la culture à Bourges 2028 !"/>
          </div>
        </div>

        <button
          className="toggle-btn bottom"
          onClick={goToAnnuaire}
        >
          Aller à l’Annuaire ↓
        </button>
      </section>
    </main>
  );
}
