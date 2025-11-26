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

export default function Map({ mapFilter, catFilter, onMapReady }) {
  const [geojsonData, setGeojsonData] = useState(null);
  const [position, setPosition] = useState(null);
  const [points, setPoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);


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

    fetch("/api/structures")
      .then((res) => res.json())
      .then((data) => {
        const points = data.map((structure) => ({
          id: structure.id,
          coords: [structure.latitude, structure.longitude],
          label: structure.nomStructure,
          type: "structure"
        }));
        setPoints(points);
      })
      .catch((err) => console.error("Erreur chargement structures:", err));
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

  useEffect(() => {
    if (!catFilter) return;

    let url = "/api/structures";
    if (catFilter && catFilter.length > 0) {
      const params = new URLSearchParams();
      params.set(
        "cats",
        catFilter.map(c => c.id).join(",")
      );
      url += `?${params.toString()}`;
    }
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const points = data.map((structure) => ({
          id: structure.id,
          coords: [structure.latitude, structure.longitude],
          label: structure.nomStructure,
          type: "structure"
        }));
        setPoints(points);
      })
      .catch((err) => console.error("Erreur chargement structures filtrées:", err));
  }, [catFilter]);

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
        {points.map(p => (
          <Marker
            key={p.id}
            position={p.coords}
            icon={selectedPoint?.id === p.id ? structIconSelected : structIcon}
            eventHandlers={{
              click: () => setSelectedPoint(p)
            }}
          />
        ))}


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