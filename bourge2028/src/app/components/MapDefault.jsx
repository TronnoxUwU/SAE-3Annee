"use client";
// src/app/components/MapDefault.jsx
import { MapContainer, TileLayer, Polygon, Marker, Popup, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { useEffect, useState } from 'react';

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css"; // importante
import "../styles/MapDefault.css";



// petit composant qui recentre la map quand "center" change
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
}




export default function Map({ mapFilter, onMapReady }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [position, setPosition] = useState(null);

  // Charger ton geojson
  useEffect(() => {
    fetch("/data/cartes/region-centre-val-de-loire.geojson")
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  // Quand mapFilter change → chercher la position
  useEffect(() => {
    console.log(mapFilter);
    if (!mapFilter) return;

    const fetchPosition = async () => {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            mapFilter
          )}`
        );
        const results = await response.json();
        if (results.length > 0) {
          const { lat, lon } = results[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.warn("Aucun résultat trouvé pour :", mapFilter);
        }
      } catch (err) {
        console.error("Erreur recherche Nominatim :", err);
      }
    };

    fetchPosition();
  }, [mapFilter]);

  return (
    <MapContainer
      center={[47.7, 1.7]}
      zoom={8}
      minZoom={5}
      style={{ height: "100vh", width: "100%" }}
      zoomControl={false}
      whenCreated={onMapReady}
    >
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
            weight: 0,
          }}
        />
        
      )}

      {position && <ChangeView center={position} zoom={12} />}
    </MapContainer>
  );
}