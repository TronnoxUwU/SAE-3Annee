"use client"; // important pour Next 13+ avec app directory
// src/app/components/Map.jsx
import { MapContainer, TileLayer, Polygon, Marker, Popup, GeoJSON, ZoomControl } from "react-leaflet";
import { useEffect, useState } from 'react';
import "leaflet/dist/leaflet.css";
import "../styles/MapDefault.css";



export default function Map() {
  const [geojsonData, setGeojsonData] = useState(null);

  useEffect(() => {
    fetch('/data/cartes/region-centre-val-de-loire.geojson')
      .then((response) => response.json())
      .then((data) => setGeojsonData(data));
  }, []);

  return (
    <MapContainer 
      center={[47.7, 1.7]} 
      zoom={8} 
      minZoom={5}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false} 
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
        >
        </GeoJSON>
      )}

    </MapContainer>
  );
}
