"use client";
import { useState, useEffect, useRef } from "react";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import * as turf from "@turf/turf";
import "../styles/Sidebar.css";

export default function Sidebar({ map, onFilterChange }) {
  const [open, setOpen] = useState(true);
  const [filters, setFilters] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState(null);
  const [regionGeoJSON, setRegionGeoJSON] = useState(null);
  const findboxRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      // console.log(results)
      if (findboxRef.current && !findboxRef.current.contains(event.target)) {
        if(results.length > 0) {
          setResults([]);
        }
        
      } else if(results.length == 0) {
          console.log(query)
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [findboxRef, results, query]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    fetch("/data/filtres/filtre-carte.json")
      .then((res) => res.json())
      .then((data) => setFilters(Object.keys(data.carte)))
      .catch((err) => console.error(err));

      
    fetch("/data/cartes/(initial)region-centre-val-de-loire.geojson")
      .then((res) => res.json())
      .then((geo) => setRegionGeoJSON(geo))
      .catch((err) => console.error("Erreur chargement région :", err));



    // Provider OSM
    class PhotonProvider {
      async search({ query }) {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr`
        );
        const data = await res.json();

        if (!data.features) return [];

        // 🔍 Transformer et filtrer les résultats
        const results = data.features.map((f) => ({
          x: f.geometry.coordinates[0],
          y: f.geometry.coordinates[1],
          label: f.properties.name,
          type: f.properties.osm_value,
          city: f.properties.city || f.properties.name,
        }));

        // 🧹 Supprimer les doublons par nom
        const uniqueResults = results.filter(
          (r, index, self) =>
            index === self.findIndex((t) => t.label === r.label && t.city === r.city)
        );

        // 🎯 Prioriser les villes
        const sortedResults = uniqueResults.sort((a, b) => {
          const priority = { city: 1, town: 2, village: 3, suburb: 4, locality: 5 };
          return (priority[a.type] || 99) - (priority[b.type] || 99);
        });

        return sortedResults;
      }
    }


    // const osmProvider = new OpenStreetMapProvider();
    const osmProvider = new PhotonProvider();
    setProvider(osmProvider);
  }, []);



  // gestion de la recherche (les prédictions de recherche)
  const searchTimeout = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value || !provider) {
      setResults([]);
      return;
    }

    // limite les requete tout les X ms
    searchTimeout.current = setTimeout(async () => {
      try {
        let results = await provider.search({ query: value });

        // Filtrage sur le geojson de la region centre
        if (regionGeoJSON) {
          results = results.filter((r) => {
            const point = turf.point([r.x, r.y]);
            return turf.booleanPointInPolygon(point, regionGeoJSON);
          });
        }

        setResults(results);
      } catch (err) {
        console.error("Erreur de recherche :", err);
      }
    }, 300);
  };



  // centrage de la map
  const handleResultClick = (result) => {
    if (!map || !result) return;
    const { x, y, label } = result;


    // ajoute un marqueur sur le zoom (je l'ai laissé commenté si jamais)

    // L.marker([y, x]).addTo(map).bindPopup(label).openPopup();
    map.setView([y, x], 14);
    setResults([]);
    setQuery(label);
  };

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      <div className="sidebar-search">
        <input
          type="text"
          id="findbox"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={handleSearch}
        />
        
      </div>
{results.length > 0 && (
          <ul className="search-results" ref={findboxRef}>
            {results.slice(0, 5).map((r, i) => (
              <li key={i} onClick={() => handleResultClick(r)}>
                {r.label}
              </li>
            ))}
          </ul>
        )}
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
