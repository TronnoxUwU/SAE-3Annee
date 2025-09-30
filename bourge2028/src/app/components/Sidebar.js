"use client";
import { useState, useEffect } from "react";
import "../styles/Sidebar.css";

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState([]);

  useEffect(() => {
    fetch("/data/filtres/filtre-carte.json")
      .then((response) => response.json())
      .then((data) => {
        setFilters(Object.keys(data.carte));
      })
      .catch((err) => console.error("Erreur de chargement des filtres :", err));
  }, []);


  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="sidebar-search">
        <div className="search">
          <img className="search-img" src="/file.svg"/>
          <form>
            <input type="text" placeholder="Cherchez une ville" className="search-input"></input>
          </form>
          <img className="search-img" src="/globe.svg"/>
        </div>
      </div>
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? "<" : ">"}
        </button>
      </div>
      <ul>
        {filters.map((filter, index) => (
          <li key={index}>
            {open ? filter : `T${index + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );
}
