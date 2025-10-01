"use client";
import { useState, useEffect } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "../styles/Sidebar.css";

export default function SidebarClient({ map }) {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    // Charger les filtres JSON
    fetch("/data/filtres/filtre-carte.json")
      .then((response) => response.json())
      .then((data) => setFilters(Object.keys(data.carte)))
      .catch((err) => console.error("Erreur de chargement des filtres :", err));

    if (!map) return; // attendre que la map soit prête

    // Ajouter GeoSearchControl
    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
    });

    map.addControl(searchControl);

    // Déplacer le contrôle dans le div #findbox après un petit délai
    setTimeout(() => {
      const sidebarDiv = document.getElementById("findbox");
      const controlDiv = document.querySelector(".geosearch");
      if (sidebarDiv && controlDiv) {
        sidebarDiv.appendChild(controlDiv);
      }
    }, 100);
  }, [map]);

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="sidebar-search">
        <div id="findbox"></div>
      </div>
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? "<" : ">"}
        </button>
      </div>
      <ul>
        {filters.map((filter, index) => (
          <li key={index}>{open ? filter : `T${index + 1}`}</li>
        ))}
      </ul>
    </div>
  );
}
