"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname  } from "next/navigation";
import StructureItem from "./structure-Item";
import tempStyle from "./structure-Item.module.css"
import { useSession } from 'next-auth/react';



export default function Structure() {
  const router = useRouter();
  const pathname = usePathname()
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { data: session } = useSession();



    async function loadCategories() {
    try {
        const res = await fetch("/api/structures?waiting=true");
        if (!res.ok) throw new Error("Structures non trouvées");

        const data = await res.json();
        setItems(data);
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
    }


    async function validateStructure(id) {
        await fetch(`/api/structures/${id}/validate`, {
        method: "PATCH",
        });
        setItems(items.filter(s => s.id !== id));
    }
    
    async function refuseStructure(id) {
        await fetch(`/api/structures/${id}`, {
        method: "DELETE",
        });
        setItems(items.filter(s => s.id !== id));
    }

    useEffect(() => {
    const fetchData = async () => {
        try {
        setLoading(true);
        await loadCategories();
        } catch (err) {
        setError(err.message);
        setLoading(false);
        }
    };

    fetchData();
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

    
  if (items.length === 0) {
    return <p>Aucune structure en attente de validation.</p>;
  }


  return (
    
    <ul className={`${tempStyle.override_list}`}>
      {items.map(item => {

      var canEdit = session?.user?.role === "Admin";
      if(!canEdit) {
        item.personnes.map(p => {canEdit = (p.role==="Createur" && p.personneId === session?.user?.id)})
      }
      var str_role;
      if(pathname.includes("account/") && pathname!==`account/${session?.user?.id}`) {
        item.personnes.map(p => {str_role = `Cette personne est ${p.role} de cette structure`})
      }
      
        return (
          <StructureItem
            key={item.id}
            id={item.id}
            nom={item.nomStructure}
            date={item.dateCreation}
            description={item.description}
            edit={canEdit}
            role={str_role}
            validate
            onValidate={validateStructure}
            onRefuse={refuseStructure}
          />
        );
      })}
    </ul>
  );

}