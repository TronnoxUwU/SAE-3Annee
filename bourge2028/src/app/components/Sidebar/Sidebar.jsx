"use client";
import { useState, useEffect, useRef } from "react";
import * as turf from "@turf/turf";
import axios from "axios";
import Style from "./Sidebar.module.css";

export default function Sidebar({ map, onFilterChange, onDepFilterChange, onSearchStructChange, isAnnuaire }) {
  const [open, setOpen] = useState(true);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [provider, setProvider] = useState(null);
  const [regionGeoJSON, setRegionGeoJSON] = useState(null);

  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [expanded, setExpanded] = useState({});

  const [departements, setDepartements] = useState([]);
  const [selectedDepartements, setSelectedDepartements] = useState([]);

  const [structQuery, setStructQuery] = useState("");
  const [structResults, setStructResults] = useState([]);

  const resultsRef = useRef(null);
  const searchRef = useRef(null);
  const searchTimeout = useRef(null);

  // ------------------- INITIALISATION -------------------
  useEffect(() => {
    axios.get("/api/categories")
      .then(res => setCategories(res.data.filter(c => c.parentId === null)))
      .catch(err => console.error("Erreur chargement catégories :", err));

    axios.get("/api/departements")
      .then(res => setDepartements(res.data))
      .catch(err => console.error("Erreur chargement départements :", err));

    fetch("/data/cartes/(initial)region-centre-val-de-loire.geojson")
      .then(res => res.json())
      .then(geo => setRegionGeoJSON(geo))
      .catch(err => console.error("Erreur chargement région :", err));

    class PhotonProvider {
      async search({ query }) {
        const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&lang=fr`);
        const data = await res.json();
        if (!data.features) return [];
        return data.features.map(f => ({
          x: f.geometry.coordinates[0],
          y: f.geometry.coordinates[1],
          label: f.properties.name,
          type: f.properties.osm_value,
          city: f.properties.city || f.properties.name,
        })).filter((v, i, self) =>
          i === self.findIndex(t => t.label === v.label && t.city === v.city)
        );
      }
    }
    setProvider(new PhotonProvider());
  }, []);

  // ------------------- RECHERCHE GEO -------------------
  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!value || !provider) {
      setResults([]);
      return;
    }
    searchTimeout.current = setTimeout(() => recherche(provider, `${value}, Centre-Val de Loire, France`), 300);
  };

  async function recherche(provider, value) {
    try {
      let searchResults = await provider.search({ query: value });
      if (regionGeoJSON) {
        searchResults = searchResults.filter(r =>
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
  };

  // ------------------- RECHERCHE STRUCTURES -------------------
  const handleStructSearch = (e) => {
    const value = e.target.value;
    setStructQuery(value);
    onSearchStructChange(value);
    fetchStructs(value);
  };

  const fetchStructs = async (value) => {
    try {
      const res = await fetch(`/api/projets?search=${encodeURIComponent(value)}`);
      if (!res.ok) throw new Error(`Erreur ${res.status}`);
      const data = await res.json();
      const infoResults = new Set();
      data.forEach(proj => {
        if (proj.nomProjet.toLowerCase().includes(value.toLowerCase())) {
          infoResults.add(proj.nomProjet);
        }
        proj.realisation.structure.forEach(struct => {
          if (struct.nomStructure.toLowerCase().includes(value.toLowerCase())) {
            infoResults.add(struct.nomStructure);
          }
        });
      });
      setStructResults(Array.from(infoResults));
    } catch (err) {
      console.error("Erreur de recherche de structures :", err);
    }
  };

  const handleStructResultClick = (result) => {
    setStructQuery(result.nomStructure);
    onSearchStructChange(result.nomStructure);
    setStructResults([]);
  };

  // ------------------- NAVIGATION CLAVIER -------------------
  useEffect(() => {
    let selectedIndex = -1;

    const getActiveResults = () => isAnnuaire ? structResults : results;

    const highlightResult = (index) => {
      const lis = resultsRef.current?.querySelectorAll(`.${Style.search_results_item}`);
      if (!lis) return;
      lis.forEach((li, i) => li.classList.toggle(Style.search_results_item_highlight, i === index));
    };

    const handleKeyDown = (e) => {
      const activeResults = getActiveResults();
      if (!activeResults.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % activeResults.length;
        highlightResult(selectedIndex);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + activeResults.length) % activeResults.length;
        highlightResult(selectedIndex);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        const result = activeResults[selectedIndex >= 0 ? selectedIndex : 0];
        if (isAnnuaire) handleStructResultClick(result);
        else handleResultClick(result);
        selectedIndex = -1;
      }
    };

    const inputEl = searchRef.current?.querySelector("input");
    inputEl?.addEventListener("keydown", handleKeyDown);
    return () => inputEl?.removeEventListener("keydown", handleKeyDown);
  }, [results, structResults, isAnnuaire]);

  // ------------------- CLIC HORS RESULTATS -------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target)
      ) {
        setResults([]);
        setStructResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ------------------- GESTION CATEGORIES -------------------
  const getAllChildrenIds = (cat) => cat.children?.flatMap(c => [c.id, ...getAllChildrenIds(c)]) || [];

  const handleCategoryToggle = (cat) => {
    const allIds = [cat.id, ...getAllChildrenIds(cat)];
    const isChecked = allIds.every(id => selectedCategories.includes(id));
    setSelectedCategories(prev => isChecked ? prev.filter(id => !allIds.includes(id)) : [...new Set([...prev, ...allIds])]);
  };

  const toggleExpand = (id) => setExpanded(prev => ({ ...prev, [id]: !prev[id] }));

  useEffect(() => {
    if (!onFilterChange) return;
    const selectedCats = [];
    const traverse = (cats) => cats.forEach(cat => {
      if (selectedCategories.includes(cat.id)) selectedCats.push(cat);
      if (cat.children?.length) traverse(cat.children);
    });
    traverse(categories);
    onFilterChange(selectedCats);
  }, [selectedCategories, categories, onFilterChange]);

  // ------------------- GESTION DEPARTEMENTS -------------------
  const handleDepartementToggle = (dep) => {
    setSelectedDepartements(prev => prev.some(d => d.id === dep.id) ? prev.filter(d => d.id !== dep.id) : [...prev, dep]);
  };

  useEffect(() => {
    onDepFilterChange?.(selectedDepartements);
  }, [selectedDepartements]);

  // ------------------- RENDU CATEGORIES -------------------
  const renderCategory = (cat, level = 0, parentChecked = false) => {
    const isExpanded = expanded[cat.id];
    const isChecked = selectedCategories.includes(cat.id);
    const isLocked = parentChecked;
    return (
      <li key={cat.id} className={Style.category_item}>
        <div 
          className={`${Style.category_label} ${isLocked ? Style.locked : ""}`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => !isLocked && handleCategoryToggle(cat)}
        >
          <div className={Style.category_left}>
            {cat.children?.length > 0 ? (
              <button className={Style.expand_btn} onClick={e => { e.stopPropagation(); toggleExpand(cat.id); }}>
                {isExpanded ? "▼" : "►"}
              </button>
            ) : <span className={Style.expand_btn_placeholder}></span>}
            <span className={Style.category_text}>{cat.nom}</span>
          </div>
          <input type="checkbox" className={Style.checkbox} checked={isChecked || isLocked} readOnly />
        </div>
        {cat.children?.length > 0 && isExpanded && (
          <ul className={Style.category_tree}>
            {cat.children.map(child => renderCategory(child, level + 1, isChecked || isLocked))}
          </ul>
        )}
      </li>
    );
  };

  // ------------------- RENDU DEPARTEMENTS -------------------
  const renderDepartement = (dep) => {
    const isChecked = selectedDepartements.some(d => d.id === dep.id);
    return (
      <li key={dep.id} className={Style.category_item}>
        <div className={Style.category_label} style={{ cursor: "pointer" }}
          onClick={() => handleDepartementToggle(dep)}>
          <div className={Style.category_left}>
            <span className={Style.category_text}>{dep.nomDep}</span>
          </div>
          <input type="checkbox" className={Style.checkbox} checked={isChecked} readOnly />
        </div>
      </li>
    );
  };

  // ------------------- RENDU SIDEBAR -------------------
  return (
    <div className={Style.sidebar}>
      <div className={Style.sidebar_search} ref={searchRef}>
        <input
          type="text"
          placeholder={isAnnuaire ? "Recherche de structure ou projet..." : "Rechercher un lieu..."}
          value={isAnnuaire ? structQuery : query}
          onChange={isAnnuaire ? handleStructSearch : handleSearch}
        />
        {isAnnuaire && structResults.length > 0 && (
          <ul className={Style.search_results} ref={resultsRef}>
            {structResults.map((r, i) => (
              <li key={i} className={Style.search_results_item} onClick={() => handleStructResultClick(r)}>
                {r}
              </li>
            ))}
          </ul>
        )}
        {!isAnnuaire && results.length > 0 && (
          <ul className={Style.search_results} ref={resultsRef}>
            {results.map((r, i) => (
              <li key={i} className={Style.search_results_item} onClick={() => handleResultClick(r)}>
                {r.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className={Style.filter_section}>
        {categories.length > 0 && (
          <>
            <li className={Style.section_title}>Filtres</li>
            {categories.map(cat => renderCategory(cat))}
          </>
        )}
        {departements.length > 0 && (
          <>
            <li className={Style.section_title}>Départements</li>
            {departements.map(dep => renderDepartement(dep))}
          </>
        )}
      </ul>
    </div>
  );
}
