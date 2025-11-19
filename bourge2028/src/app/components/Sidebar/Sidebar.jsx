"use client";
import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import axios from "axios";
import Style from "./Sidebar.module.css";

export default function Sidebar({ map, onFilterChange, onGeoFilterChange }) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState(null);
  const [regionGeoJSON, setRegionGeoJSON] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState({});

  const resultsRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  // ------------------------------------------------------------
  // Initialisation
  // ------------------------------------------------------------
  useEffect(() => {
    if (typeof window === "undefined") return;

    axios
      .get("/api/categories")
      .then((res) => setCategories(res.data.filter((c) => c.parentId === null)))
      .catch((err) => console.error("Erreur chargement catégories :", err));

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
        const results = data.features.map((f) => ({
          x: f.geometry.coordinates[0],
          y: f.geometry.coordinates[1],
          label: f.properties.name,
          type: f.properties.osm_value,
          city: f.properties.city || f.properties.name,
        }));
        const unique = results.filter(
          (r, i, self) =>
            i === self.findIndex((t) => t.label === r.label && t.city === r.city)
        );
        return unique;
      }
    }

    setProvider(new PhotonProvider());
  }, []);

  // ------------------------------------------------------------
  // Recherche géographique
  // ------------------------------------------------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value || !provider) {
      setResults([]);
      return;
    }

    searchTimeout.current = setTimeout(() => recherche(provider, value), 300);
  };

  async function recherche(provider, value) {
    try {
      let searchResults = await provider.search({ query: value });

      if (regionGeoJSON) {
        searchResults = searchResults.filter((r) =>
          turf.booleanPointInPolygon(turf.point([r.x, r.y]), regionGeoJSON)
        );
      }

      setResults(searchResults);
    } catch (err) {
      console.error("Erreur de recherche :", err);
    }
  }

  const handleResultClick = (result) => {
    if (!map || !result) return;
    map.setView([result.y, result.x], 14);
    setResults([]);
    setQuery(result.label);
    onGeoFilterChange &&
      onGeoFilterChange({
        lat: result.y,
        lng: result.x,
        radius: 10,
      });
  };

  // ------------------------------------------------------------
  // Navigation clavier
  // ------------------------------------------------------------
  useEffect(() => {
    let selectedIndex = -1;

    const highlightResult = (index) => {
      const lis = resultsRef.current?.querySelectorAll(`.${Style.search_results_item}`);
      if (!lis) return;
      lis.forEach((li, i) =>
        li.classList.toggle(Style.search_results_item_highlight, i === index)
      );
    };

    const handleKeyDown = (e) => {
      if (results.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % results.length;
        highlightResult(selectedIndex);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + results.length) % results.length;
        highlightResult(selectedIndex);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const result = results[selectedIndex >= 0 ? selectedIndex : 0];
        handleResultClick(result);
        setResults([]);
        selectedIndex = -1;
      }
    };

    const inputEl = searchRef.current?.querySelector("input");
    if (inputEl) inputEl.addEventListener("keydown", handleKeyDown);

    return () => inputEl?.removeEventListener("keydown", handleKeyDown);
  }, [results]);

  // ------------------------------------------------------------
  // Gestion catégories multi-niveaux
  // ------------------------------------------------------------
  const getAllChildrenIds = (cat) => {
    if (!cat.children) return [];
    return cat.children.flatMap((child) => [child.id, ...getAllChildrenIds(child)]);
  };

  const handleCategoryToggle = (cat) => {
    const allIds = [cat.id, ...getAllChildrenIds(cat)];
    const isChecked = allIds.every((id) => selectedCategories.includes(id));

    if (isChecked) {
      setSelectedCategories((prev) => prev.filter((id) => !allIds.includes(id)));
    } else {
      setSelectedCategories((prev) => [...new Set([...prev, ...allIds])]);
    }
  };

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // ------------------------------------------------------------
  // Construction mapFilter
  // ------------------------------------------------------------
  useEffect(() => {
    if (!onFilterChange) return;

    const categoriesList = [];

    const traverse = (cats, hasParent = false) => {
      cats.forEach((cat) => {
        const isSelected = selectedCategories.includes(cat.id);
        if (isSelected) {
          const info = { id: cat.id, nom: cat.nom };
          categoriesList.push(info);
        }
        if (cat.children?.length) traverse(cat.children, true);
      });
    };

    traverse(categories);
    onFilterChange({ categories: categoriesList });
  }, [selectedCategories, categories, onFilterChange]);

  // ------------------------------------------------------------
  // Rendu récursif
  // ------------------------------------------------------------
  const renderCategory = (cat, level = 0, parentChecked = false) => {
    const isExpanded = expanded[cat.id];
    const isChecked = selectedCategories.includes(cat.id);
    const isLocked = parentChecked;
    const paddingLeft = 10 + level * 15;

    return (
      <li key={cat.id} className={Style.category_item}>
        <div
          className={`${Style.category_label} ${isLocked ? Style.locked : ""}`}
          style={{ paddingLeft: `${paddingLeft}px` }}
          onClick={() => {
            if (!isLocked) handleCategoryToggle(cat);
          }}
        >
          <div className={Style.category_left}>
            {cat.children?.length > 0 && (
              <button
                className={Style.expand_btn}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(cat.id);
                }}
              >
                {isExpanded ? "▼" : "►"}
              </button>
            )}
            {!cat.children?.length && (
              <span className={Style.expand_btn_placeholder}></span>
            )}
            <span className={Style.category_text}>{cat.nom}</span>
          </div>

          <input
            type="checkbox"
            checked={isChecked || isLocked}
            onChange={(e) => {
              e.stopPropagation();
              if (!isLocked) handleCategoryToggle(cat);
            }}
            className={Style.checkbox}
            disabled={isLocked}
          />
        </div>

        {cat.children?.length > 0 && isExpanded && (
          <ul className={Style.category_tree}>
            {cat.children.map((child) =>
              renderCategory(child, level + 1, isChecked || isLocked)
            )}
          </ul>
        )}
      </li>
    );
  };

  // ------------------------------------------------------------
  // Rendu Sidebar
  // ------------------------------------------------------------
  return (
    <div className={`${Style.sidebar} ${open ? "" : "collapsed"}`}>
      <div className={Style.sidebar_search} ref={searchRef}>
        <input
          type="text"
          placeholder="Rechercher un lieu..."
          value={query}
          onChange={handleSearch}
        />
        {results.length > 0 && (
          <ul className={Style.search_results} ref={resultsRef}>
            {results.map((r, i) => (
              <li
                key={i}
                className={Style.search_results_item}
                onClick={() => handleResultClick(r)}
              >
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={Style.sidebar_header}>
        {open && <span>Filtres</span>}
        <button onClick={() => setOpen(!open)}>{open ? "<" : ">"}</button>
      </div>

      <ul className={Style.filter_section}>
        {categories.map((cat) => renderCategory(cat))}
      </ul>
    </div>
  );
}
