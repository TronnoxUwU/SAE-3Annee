"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import "../styles/home.css";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const Sidebar = dynamic(() => import("../components/Sidebar (old)"), { ssr: false });
const Annuaire = dynamic(() => import("../components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  const router = useRouter();
  const [animateDrawer, setAnimateDrawer] = useState(false);

  useEffect(() => {
    setAnimateDrawer(true); // drawer ouvert dès le rendu
  }, []);

  const handleClose = () => {
    setAnimateDrawer(false);
    setTimeout(() => router.push("/", { shallow: true }), 600);
  };

  return (
    <main className="main-container">
      <section className="section-map">
        <Sidebar map={null} onFilterChange={() => {}} />

        <div className="map-wrapper">
          <div className="map-inner">
            <Map mapFilter={null} onMapReady={() => {}} />
          </div>
        </div>

        <section className={`section-annuaire ${animateDrawer ? "show" : ""}`}>
          <Annuaire mapFilter={null} />
        </section>

        <button
          className={`toggle-btn ${animateDrawer ? "top" : "bottom"}`}
          onClick={handleClose}
        >
          {animateDrawer ? "Revenir à la carte ↑" : "Aller à l’Annuaire ↓"}
        </button>
      </section>
    </main>
  );
}
