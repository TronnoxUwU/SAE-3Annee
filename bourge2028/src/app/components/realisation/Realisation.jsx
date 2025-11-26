"use client";

import { useEffect, useState } from "react";

export default function ProjetView({ id }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`http://localhost:3000/api/realisations/${id}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Erreur fetch:", err);
      }
    }
    load();
  }, [id]);

  if (!data) return <div className="text-center mt-5">Chargement...</div>;

  const collaborateurs = data.structure || [];

  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>

      {/* CONTENU */}
      <div
        className="container mt-5 p-4"
        style={{ background: "white", borderRadius: 12 }}
      >
        <div className="row">
          <div className="col-md-5">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: 350,
                borderRadius: 20,
                color: "black",
                fontSize: 80,
              }}
            >
              🖼️
            </div>
          </div>

          <div className="col-md-7">
            <h1 className="fw-bold mt-3 mt-md-0">{data.nom}</h1>
            <p>{data.description || "Aucune description disponible."}</p>
          </div>
        </div>

        <h2 className="text-center fw-bold mt-5">A propos de ce projet :</h2>

        <h2 className="text-center fw-bold mt-5">Les collaborateurs</h2>

        <div className="row mt-4">
          {collaborateurs.length === 0 && (
            <p className="text-center text-muted">Aucun collaborateur.</p>
          )}

          {collaborateurs.map((struct) => (
            <div className="col-md-3 mb-3" key={struct.id}>
              <div
                className="d-flex justify-content-center align-items-center text-white"
                style={{
                  background: "#222",
                  height: 120,
                  borderRadius: 20,
                  fontSize: 18,
                }}
              >
                {struct.nomStructure}
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}
