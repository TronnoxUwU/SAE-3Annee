"use client";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap, Marker, useMapEvent } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "./MapDefault.css";
import ApercuPoint from "./ApercuPoint.jsx";

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Composant pour détecter les clics sur la carte
function MapClickHandler({ onMapClick }) {
  useMapEvent("click", () => {
    onMapClick();
  });
  return null;
}

export default function Map({ mapFilter, catFilter, depFilter, onMapReady }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [position, setPosition] = useState(null);
  const [pointsStructure, setPointsStructure] = useState([]);
  const [pointsProjet, setPointsProjet] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [allPointsStructure, setAllPointsStructure] = useState([]);
  const [allPointsProjet, setAllPointsProjet] = useState([]);


  const structIcon = L.icon({
    iconUrl: "/icons/structure-icon.svg",
    iconSize: [25 * 2, 41 * 2],
    iconAnchor: [12 * 2, 41 * 2],
  });
  const structIconSelected = L.icon({
    iconUrl: "/icons/structure-icon.svg",
    iconSize: [25 * 2 * 1.3, 41 * 2 * 1.3],
    iconAnchor: [12 * 2 * 1.3, 41 * 2 * 1.3],
  });
  const realisationIcon = L.icon({
    iconUrl: "/icons/realisation-icon.svg",
    iconSize: [25 * 2, 41 * 2],
    iconAnchor: [12 * 2, 41 * 2],
  });
  const realisationIconSelected = L.icon({
    iconUrl: "/icons/realisation-icon.svg",
    iconSize: [25 * 2 * 1.3, 41 * 2 * 1.3],
    iconAnchor: [12 * 2 * 1.3, 41 * 2 * 1.3],
  });

  useEffect(() => {
    fetch("/data/cartes/region-centre-val-de-loire.geojson")
      .then((res) => res.json())
      .then((data) => setGeojsonData(data))
      .catch((err) => console.error("Erreur chargement GeoJSON:", err));
  }, []);

  useEffect(() => {
    if (!mapFilter) return;
    const fetchPosition = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(mapFilter)}`
        );
        const results = await res.json();
        if (results.length > 0) {
          const { lat, lon } = results[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        }
      } catch (err) {
        console.error("Erreur géocodage:", err);
      }
    };

    fetchPosition();
  }, [mapFilter]);

  // useEffect(() => {
  //   if (!catFilter && !depFilter) return;

  //   let urlStruct = "/api/structures";

  //   // if (catFilter && catFilter.length > 0) {
  //   //   const params = new URLSearchParams();
  //   //   params.set("cats", catFilter.map(c => c.id).join(","));
  //   //   urlStruct += `?${params.toString()}`;
  //   // }

  //   // if (depFilter && depFilter.length > 0) {
  //   //   const params = new URLSearchParams();
  //   //   params.set("deps", depFilter.map(d => d.id).join(","));
  //   //   urlStruct += (urlStruct.includes("?") ? "&" : "?") + params.toString();
  //   // }

  //   fetch(urlStruct)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAllPointsStructure(data);
  //     });

  //   let urlProjet = "/api/projets";

  //   // if (catFilter && catFilter.length > 0) {
  //   //   const params = new URLSearchParams();
  //   //   params.set("cats", catFilter.map(c => c.id).join(","));
  //   //   urlProjet += `?${params.toString()}`;
  //   // }

  //   // if (depFilter && depFilter.length > 0) {
  //   //   const params = new URLSearchParams();
  //   //   params.set("deps", depFilter.map(d => d.id).join(","));
  //   //   urlProjet += (urlProjet.includes("?") ? "&" : "?") + params.toString();
  //   // }

  //   fetch(urlProjet)
  //     .then((res) => res.json())
  //     .then((data) => {
  //       setAllPointsProjet(data);
  //     });

  // }, [catFilter, depFilter]);

useEffect(() => {
    // Charger toutes les structures au démarrage
    fetch("/api/structures")
      .then((res) => res.json())
      .then((data) => {
        const points = data.map((structure) => ({
          id: "struct_"+structure.id,
          coords: [structure.latitude, structure.longitude],
          label: structure.nomStructure,
          type: "structure",
          categories: structure.cats?.map(cat => cat.id) || [],
          departementId: structure.departements?.[0]?.id || null
        }));
        setAllPointsStructure(points);
      })
      .catch(err => console.error("Erreur chargement structures:", err));

    // Charger tous les projets au démarrage
    fetch("/api/projets")
      .then((res) => res.json())
      .then((data) => {
        const points = data.map((projet) => ({
          id: "projet_"+projet.id,
          coords: [projet.latitude, projet.longitude],
          label: projet.nomProjet,
          type: "projet",
          categories: projet.realisation?.cats?.map(cat => cat.id) || [],
          departementId: projet.departement?.[0]?.id || null
        }));
        setAllPointsProjet(points);
      })
      .catch(err => console.error("Erreur chargement projets:", err));
  }, []);

  // Fonction pour filtrer les projets
  const filterPointsProjet = (points) => {
    return points.filter(point => {
      // Filtre par catégorie
      if (catFilter && catFilter.length > 0) {
        const catIds = catFilter.map(c => c.id);
        const hasMatchingCat = point.categories?.some(catId => catIds.includes(catId));
        if (!hasMatchingCat) return false;
      }
      
      // Filtre par département
      if (depFilter && depFilter.length > 0) {
        const depIds = depFilter.map(d => d.id);
        if (!depIds.includes(point.departementId)) return false;
      }
      
      return true;
    });
  };

  // Fonction pour filtrer les structures
  const filterPointsStructure = (points) => {
    return points.filter(point => {
      // Filtre par catégorie
      if (catFilter && catFilter.length > 0) {
        const catIds = catFilter.map(c => c.id);
        const hasMatchingCat = point.categories?.some(catId => catIds.includes(catId));
        if (!hasMatchingCat) return false;
      }

      // Filtre par département
      if (depFilter && depFilter.length > 0) {
        const depIds = depFilter.map(d => d.id);
        if (!depIds.includes(point.departementId)) return false;
      }

      return true;
    });
  };

  // Appliquer les filtres quand ils changent
  useEffect(() => {
    setPointsProjet(filterPointsProjet(allPointsProjet));
    setPointsStructure(filterPointsStructure(allPointsStructure));
  }, [allPointsProjet, allPointsStructure, catFilter, depFilter]);

  return (
    <div className="map" style={{ height: "100vh", width: "100%" }}>

      <MapContainer
        center={[47.7, 1.7]}
        zoom={8}
        minZoom={5}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        whenReady={(mapInstance) => {
          if (onMapReady) onMapReady(mapInstance.target);
        }}
      >

        <MapClickHandler onMapClick={() => setSelectedPoint(null)} />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <ZoomControl position="topright" />

        {geojsonData && (
          <GeoJSON
            data={geojsonData}
            style={{
              fillColor: "rgba(0,0,0,0.9)",
              color: "transparent",
              weight: 0
            }}
          />
        )}
        {pointsStructure.map(p => {
          if (!p.coords || p.coords.includes(null)) return null

          return (
            <Marker
              key={p.id}
              position={p.coords}
              icon={selectedPoint?.id === p.id ? structIconSelected : structIcon}
              eventHandlers={{
                click: () => setSelectedPoint(p)
              }}
            />
          )
        })}

        {pointsProjet.map(p => {
          if (!p.coords || p.coords.includes(null)) return null
          return (
            <Marker
              key={p.id}
              position={p.coords}
              icon={selectedPoint?.id === p.id ? realisationIconSelected : realisationIcon}
              eventHandlers={{
                click: () => setSelectedPoint(p)
              }}
            />
          )
        })}
        {position && <ChangeView center={position} zoom={12} />}
      </MapContainer>
      {selectedPoint && (
        <ApercuPoint
          id={selectedPoint.id}
          type={selectedPoint.type}
        />
      )}

    </div>
  );
}