"use client";
import { useState, useEffect } from "react";
import { OpenStreetMapProvider, GeoSearchControl } from "leaflet-geosearch";
import "../styles/Sidebar.css";

export default function Sidebar({ map, onFilterChange }) {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return; // ⚡ sécurité SSR

    fetch("/data/filtres/filtre-carte.json")
      .then((res) => res.json())
      .then((data) => setFilters(Object.keys(data.carte)))
      .catch((err) => console.error(err));

    if (!map) return;

    const provider = new OpenStreetMapProvider();
    const searchControl = new GeoSearchControl({
      provider,
      style: "bar",
      showMarker: true,
      autoClose: true,
    });

    map.addControl(searchControl);

    setTimeout(() => {
      const sidebarDiv = document.getElementById("findbox");
      const controlDiv = document.querySelector(".geosearch");
      if (sidebarDiv && controlDiv) sidebarDiv.appendChild(controlDiv);
    }, 100);
  }, [map]);

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="sidebar-search">
        <div id="findbox"></div>
      </div>
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>{open ? "<" : ">"}</button>
      </div>
      <ul>
        {filters.map((filter, i) => (
          <li key={i} onClick={() => onFilterChange(filter)}>
            {open ? filter : `T${i + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
