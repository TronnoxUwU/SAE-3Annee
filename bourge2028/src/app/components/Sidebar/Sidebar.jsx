"use client";
import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import axios from "axios";
import Style from "./Sidebar.module.css";

export default function Sidebar({ map, onFilterChange, onGeoFilterChange }) {
  const [open, setOpen] = useState(true);

  // --- Recherche géographique ---
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState(null);
  const [regionGeoJSON, setRegionGeoJSON] = useState(null);

  // --- Filtres catégories/tags ---
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
        searchResults = searchResults.filter((r) => {
          const point = turf.point([r.x, r.y]);
          return turf.booleanPointInPolygon(point, regionGeoJSON);
        });
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
  // Navigation clavier dans les résultats
  // ------------------------------------------------------------
  useEffect(() => {
    let selectedIndex = -1;

    function highlightResult(index) {
      const lis = resultsRef.current?.querySelectorAll(`.${Style.search_results_item}`);
      if (!lis) return;
      lis.forEach((li, i) => li.classList.toggle(Style.search_results_item_highlight, i === index));
    }

    function handleKeyDown(e) {
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
    }

    const inputEl = searchRef.current?.querySelector("input");
    if (inputEl) inputEl.addEventListener("keydown", handleKeyDown);

    return () => {
      if (inputEl) inputEl.removeEventListener("keydown", handleKeyDown);
    };
  }, [results]);

  // ------------------------------------------------------------
  // Gestion des catégories
  // ------------------------------------------------------------
  const getAllChildrenIds = (category) => {
    const ids = [];
    if (!category.children) return ids;
    for (const child of category.children) {
      ids.push(child.id);
      ids.push(...getAllChildrenIds(child));
    }
    return ids;
  };

  const handleCategoryToggle = (category) => {
    const allIds = [category.id, ...getAllChildrenIds(category)];
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
  // Construction mapFilter final : only selected → categories (racines), tags (enfants)
  // ------------------------------------------------------------
  useEffect(() => {
    if (!onFilterChange) return;

    const categoryNames = [];
    const tagNames = [];

    function traverse(cats, hasParent = false) {
      for (const cat of cats) {
        const isSelected = selectedCategories.includes(cat.id);
        if (isSelected) {
          if (hasParent) {
            tagNames.push(cat.nom); // enfant → tag
          } else {
            categoryNames.push(cat.nom); // racine → category
          }
        }

        if (cat.children && cat.children.length > 0) {
          traverse(cat.children, true); // enfants ont un parent
        }
      }
    }

    traverse(categories);

    onFilterChange({
      categories: categoryNames,
      tags: tagNames,
    });
  }, [selectedCategories, categories, onFilterChange]);

  // ------------------------------------------------------------
  // Rendu récursif des catégories
  // ------------------------------------------------------------
  const renderCategory = (cat, level = 0) => {
    const isExpanded = expanded[cat.id];
    const isChecked = selectedCategories.includes(cat.id);
    const paddingLeft = 10 + level * 15;

    return (
      <li key={cat.id} className={Style.category_item}>
        <div
          className={Style.category_label}
          style={{ paddingLeft: `${paddingLeft}px` }}
        >
          {cat.children && cat.children.length > 0 && (
            <button
              className={Style.expand_btn}
              onClick={() => toggleExpand(cat.id)}
            >
              {isExpanded ? "▼" : "►"}
            </button>
          )}
          <input
            type="checkbox"
            checked={isChecked}
            onChange={() => handleCategoryToggle(cat)}
            className={Style.checkbox}
          />
          {cat.nom}
        </div>

        {cat.children && cat.children.length > 0 && isExpanded && (
          <ul className={Style.category_tree}>
            {cat.children.map((child) => renderCategory(child, level + 1))}
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
      {/* Zone de recherche */}
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

      {/* Header + collapse */}
      <div className={Style.sidebar_header}>
        {open && <span>Filtres</span>}
        <button onClick={() => setOpen(!open)}>{open ? "<" : ">"}</button>
      </div>

      {/* Filtres catégories/tags */}
      <ul className={Style.filter_section}>
        {categories.map((cat) => renderCategory(cat))}
      </ul>
    </div>
  );
}
