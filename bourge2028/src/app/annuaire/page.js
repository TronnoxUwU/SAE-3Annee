"use client";

import dynamic from "next/dynamic";
import Drawer from "../components/Drawer";
import "../styles/home.css";

const Map = dynamic(() => import("../components/Map"), { ssr: false });
const Sidebar = dynamic(() => import("../components/Sidebar"), { ssr: false });
const Annuaire = dynamic(() => import("../components/annuaire/Annuaire"), { ssr: false });

export default function AnnuairePage() {
  return (
    <main className="main-container">
      <section className="section-map">
        <Sidebar map={null} onFilterChange={() => {}} />

        <div className="map-wrapper">
          <div className="map-inner">
            <Map mapFilter={null} onMapReady={() => {}} />
          </div>
        </div>

        <Drawer closePath="/">
          <Annuaire mapFilter={null} />
        </Drawer>
      </section>
    </main>
  );
}
