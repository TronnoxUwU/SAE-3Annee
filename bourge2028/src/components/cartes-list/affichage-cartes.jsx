"use client";

import { useEffect, useState } from "react";
import CarteItem from "./carte-item";

export default function AdminCarteWaiting({ waiting = false }) {
  const [cartes, setCartes] = useState([]);

  useEffect(() => {
    fetch(`/api/cartes?waiting=${waiting}`)
      .then(res => res.json())
      .then(setCartes)
      .catch(console.error);
  }, [waiting]);

  if (cartes.length === 0) {
    return <p>Aucune carte en attente.</p>;
  }

  return (
    <div>
      {cartes.map(carte => (
        <CarteItem key={carte.id} carte={carte} />
      ))}
    </div>
  );
}
