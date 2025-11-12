"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StructureItem from "./structure-Item";
import tempStyle from "./structure-Item.module.css"
import { useSession } from 'next-auth/react';



export default function Structure() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();



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

      const canEdit = session?.user?.role === "Admin";
      if(!canEdit) {
        item.personnes.map(p => {const canEdit = (p.role==="Createur" && p.personneId === session?.user?.id)})
      }

        return (
          <StructureItem
            key={item.id}
            id={item.id}
            nom={item.nomStructure}
            date={item.dateCreation}
            description={item.description}
            edit={canEdit}
          />
        );
      })}
    </ul>
  );

}