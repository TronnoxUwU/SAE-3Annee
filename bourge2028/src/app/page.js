"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles/home.css";

const Map = dynamic(() => import("./components/Map"), { ssr: false });
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });
import Topbar from "./components/Topbar.jsx";



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
            <Topbar />
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
