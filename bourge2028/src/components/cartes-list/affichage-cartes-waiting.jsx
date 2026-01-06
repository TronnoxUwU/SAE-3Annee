"use client";

import { useEffect, useState } from "react";
import CarteItem from "./carte-item";

export default function AdminCarteWaiting() {
  const [cartes, setCartes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadCartes() {
    const res = await fetch("/api/cartes?waiting=true");
    if (!res.ok) {
      throw new Error("Elements non trouvées");
    }
    const data = await res.json();
    setCartes(data);
    setLoading(false);
  }

  async function validateCarte(id) {
    await fetch(`/api/cartes/${id}/validate`, { method: "PATCH" });
    setCartes(cartes.filter(c => c.id !== id));
  }
  
  async function refuseCarte(id) {
    await fetch(`/api/cartes/${id}`, { method: "DELETE" });
    setCartes(cartes.filter(c => c.id !== id));
  }

  useEffect(() => {
    try {
      setLoading(true);
      loadCartes(); 
    } catch (err) {
      setError(err.message);
    }
  }, []);

  if (loading) {
    return (
      <>
        {/* <div className={Style.userPage}> */}
        <div>
          <div className="d-flex justify-content-center align-items-center">
            <div className="text-center">
              <div className="spinner-border text-primary mb-3" role="status">
                <span className="visually-hidden">Chargement...</span>
              </div>
              <p className="text-muted">Chargement des données...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
      return (
        <>
          {/* <div className={Style.userPage}> */}
          <div>
            <h1>Erreur</h1>
            <p>{error}</p>
          </div>
        </>
      );
    }

  if (cartes.length === 0) {
    return <p>Aucune carte en attente de validation.</p>;
  }

  return (
    <ul className="p-0">
      {cartes.map(carte => (
        <CarteItem
          key={carte.id}
          id={carte.id}
          titre={carte.titre}
          descriptionCarte={carte.descriptionCarte}
          lienCarte={carte.lienCarte}
          categories={carte.categories}
          validate
          onValidate={validateCarte}
          onRefuse={refuseCarte}
        />
      ))}
    </ul>
  );
}
