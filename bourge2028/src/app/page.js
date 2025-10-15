"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

// import des composants
const Map = dynamic(() => import('./components/Map'), {
  ssr: false,
  loading: () => <div>Chargement de la carte...</div>
});
const Sidebar = dynamic(() => import("./components/Sidebar"), { ssr: false });
import Topbar from "./components/Topbar.jsx";



export default function Page() {
  const [mapInstance, setMapInstance] = useState(null);
  const [mapFilter, setMapFilter] = useState(null);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar map={mapInstance} onFilterChange={setMapFilter} />
      <Map mapFilter={mapFilter} onMapReady={setMapInstance} />
      <Topbar />
    </div>
  );
}
