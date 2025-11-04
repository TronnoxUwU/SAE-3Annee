"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StructureItem from "./structure-Item";
import tempStyle from "./structure-Item.module.css"

export default function AdminStructure() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadCategories() {
    const res = await fetch("/api/structures");
    if (!res.ok) {
      throw new Error("Structure non trouvée");
    }
    const data = await res.json();
    console.log(data);
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { 
    try {
      setLoading(true);
      loadCategories(); 
    } catch (err) {
      setError(err.message);
    }

  }, []);

  if (loading) {
    return (
      <>
        {/* <div className={Style.userPage}> */}
        <div>
          <p>Chargement...</p>
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
            <button onClick={() => router.push("/admin")}>
              Retour aux structures
            </button>
          </div>
        </>
      );
    }

  return (
    <ul className={`${tempStyle.override_list}`}>
      {items.map(item => {
        return (
          <StructureItem
            key={item.id}
            id={item.id}
            nom={item.nomStructure}
            date={item.dateCreation}
            description={item.description}
          />
        );
      })}
    </ul>
  );

}