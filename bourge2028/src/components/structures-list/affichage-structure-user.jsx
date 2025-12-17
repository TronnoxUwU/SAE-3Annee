"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname  } from "next/navigation";
import StructureItem from "./structure-Item";
import tempStyle from "./structure-Item.module.css"
import { useSession } from 'next-auth/react';



export default function Structure({userId}) {
  const router = useRouter();
  const pathname = usePathname()
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var { data: session } = useSession();
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))



  async function loadCategories() {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) {
      throw new Error("Utilisateur non trouvée");
    }
    var data = await res.json();
    data = data["structures"]
    // console.log(data);
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
            <h1>Erreur lors du chargement des structures</h1>
            <p>{error}</p>
            {/* <button onClick={() => router.push("/admin")}>
              Retour aux structures
            </button> */}
          </div>
        </>
      );
    }

  return (
  <>
    {items.length === 0 ? session?.user?.id===userId ?(
      <h3>Vous n'êtes membre d'aucune structure</h3>
    ): (<h3>Cette personne n'est membre d'aucune structure</h3>) : (
      <ul className={`${tempStyle.override_list}`}>
        {items.map((item) => {
          var canEdit = session?.user?.role === "Admin";
          if (!canEdit) {
            canEdit =
              item.id === session?.user?.id && item.role === "Createur";
          }
          var str_role;
          if (pathname.includes("account/") && pathname !== `account/${userId}`) {
            str_role = `Cette personne est ${item.role} de cette structure`;
          }
          const structure = item.structure;

          return (
            <StructureItem
              key={structure.id}
              id={structure.id}
              nom={structure.nomStructure}
              date={structure.dateCreation}
              description={structure.description}
              edit={canEdit}
              role={str_role}
            />
          );
        })}
      </ul>
    )}
  </>
);

}