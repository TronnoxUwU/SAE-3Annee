"use client";
import { MapContainer, TileLayer, GeoJSON, ZoomControl, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import "../styles/MapDefault.css";

function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function Map({ mapFilter, onMapReady }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [position, setPosition] = useState(null);

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



  return (
    <div style={{ height: "100vh", width: "100%" }}>
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
        {position && <ChangeView center={position} zoom={12} />}
      </MapContainer>
    </div>
  );
}