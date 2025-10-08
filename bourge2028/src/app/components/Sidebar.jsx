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
  const resultsRef = useRef(null);
  const searchRef = useRef(null);

  // Gestion du clic en dehors de la recherche
  useEffect(() => {
    function handleClickOutside(event) {
      if ( (resultsRef.current && !resultsRef.current.contains(event.target)) && (searchRef.current && !searchRef.current.contains(event.target)) ) {
        // console.log(resultsRef.current.contains(event.target));
        // console.log(searchRef.current.contains(event.target));
        if (results.length > 0) {
          // console.log("suppr")
          setResults([]);
        }
      } else if((resultsRef.current && resultsRef.current.contains(event.target)) || (searchRef.current && searchRef.current.contains(event.target)) && results.length == 0) {
          // console.log(query)
          if(provider){recherche(provider, query)}
          
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [results]);

  // Init
  useEffect(() => {
    if (typeof window === "undefined") return;

    // filtre
    fetch("/data/filtres/filtre-carte.json")
      .then((res) => res.json())
      .then((data) => setFilters(Object.keys(data.carte)))
      .catch((err) => console.error("Erreur chargement filtres :", err));

    // geojson pour photon
    fetch("/data/cartes/(initial)region-centre-val-de-loire.geojson")
      .then((res) => res.json())
      .then((geo) => setRegionGeoJSON(geo))
      .catch((err) => console.error("Erreur chargement région :", err));


    class PhotonProvider {
      async search({ query }) {
        const res = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr`
        );
        const data = await res.json();

        if (!data.features) return [];

        // Transformation des résultats
        const results = data.features.map((f) => ({
          x: f.geometry.coordinates[0],
          y: f.geometry.coordinates[1],
          label: f.properties.name,
          type: f.properties.osm_value,
          city: f.properties.city || f.properties.name,
        }));

        // Suppression des doublons par nom et ville
        const uniqueResults = results.filter(
          (r, index, self) =>
            index === self.findIndex((t) => t.label === r.label && t.city === r.city)
        );

        // Priorisation des types de lieux
        const sortedResults = uniqueResults.sort((a, b) => {
          const priority = { city: 1, town: 2, village: 3, suburb: 4, locality: 100 };
          return (priority[a.type] || 99) - (priority[b.type] || 99);
        });

        return sortedResults;
      }
    }

    // const provider = new OpenStreetMapProvider();
    const provider = new PhotonProvider();
    setProvider(provider);
  }, []);

  const searchTimeout = useRef(null);

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    
    if (!value || !provider) {
      setResults([]);
      return;
    }

    // delai de 300ms pour limiter les requêtes
    searchTimeout.current = setTimeout(async () => {
      // try {
      //   let searchResults = await provider.search({ query: value });

      //   // restriction sur la region centre
      //   if (regionGeoJSON) {
      //     searchResults = searchResults.filter((r) => {
      //       const point = turf.point([r.x, r.y]);
      //       return turf.booleanPointInPolygon(point, regionGeoJSON);
      //     });
      //   }

      //   setResults(searchResults);
      // } catch (err) {
      //   console.error("Erreur de recherche :", err);
      // }
      return recherche(provider, value);
    }, 300);
  };




  // selection d'un resultat
  const handleResultClick = (result) => {
    if (!map || !result) return;
    
    const { x, y, label } = result;

    // ajoute un marqueur (je l'ai commenté mais laissé si jamais)
    // L.marker([y, x]).addTo(map).bindPopup(label).openPopup();
    
    map.setView([y, x], 14);
    setResults([]);
    setQuery(label);
  };

  return (
    <div className={`sidebar ${open ? "" : "collapsed"}`}>
      {/* Zone de recherche */}
      <div className="sidebar-search" ref={searchRef}>
        <input
          type="text"
          id="findbox"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={handleSearch}
        />
      </div>

      {/* Résultats de recherche */}
      {results.length > 0 && (
        <ul className="search-results" ref={resultsRef}>
          {results.slice(0, 5).map((r, i) => (
            <li key={i} onClick={() => handleResultClick(r)}>
              {r.label}
            </li>
          ))}
        </ul>
      )}

      {/* Header avec bouton collapse */}
      <div className="sidebar-header">
        {open && <span>Menu</span>}
        <button onClick={() => setOpen(!open)}>
          {open ? "<" : ">"}
        </button>
      </div>

      {/* Liste des filtres */}
      <ul className="filter-list">
        {filters.map((filter, i) => (
          <li key={i} onClick={() => onFilterChange && onFilterChange(filter)}>
            {open ? filter : `T${i + 1}`}
          </li>
        ))}
      </ul>
    </div>
  );




  async function recherche(provider, value){
    try {
      let searchResults = await provider.search({ query: value });

      // restriction sur la region centre
      if (regionGeoJSON) {
        searchResults = searchResults.filter((r) => {
          const point = turf.point([r.x, r.y]);
          return turf.booleanPointInPolygon(point, regionGeoJSON);
        });
      }

      setResults(searchResults);
    } catch (err) {
      console.error("Erreur de recherche :", err);
    }
  };


}

