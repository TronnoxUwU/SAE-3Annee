"use client";

import { use, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import StructureItem from "./structure-Item";
import tempStyle from "./structure-Item.module.css"
import { useSession } from 'next-auth/react';
import { prisma } from "@/lib/prisma";
import { set } from "date-fns";


export default function Structure({ userId }) {
  const router = useRouter();
  const pathname = usePathname()
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  var { data: session } = useSession();
  const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))
  const [rolesById, setRolesById] = useState({});



  async function loadCategories() {
    const res = await fetch(`/api/users/${userId}`);
    if (!res.ok) {
      throw new Error("Utilisateur non trouvé");
    }
    const data = await res.json();
    const structures = data.structures;
    setItems(structures);

    // charger les rôles une seule fois
    const roles = {};
    await Promise.all(
      structures.map(async (item) => {
        if (item.role>=0 && !roles[item.role]) {
          const resRole = await fetch(`/api/role/${item.role}`);
          if (resRole.ok) {
            const roleData = await resRole.json();
            roles[item.role] = roleData.nom;
          }
        }
      })
    );

    setRolesById(roles);
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
      {items.length === 0 ? session?.user?.id === userId ? (
        <h3>Vous n'êtes membre d'aucune structure</h3>
      ) : (<h3>Cette personne n'est membre d'aucune structure</h3>) : (
        <ul className={`${tempStyle.override_list}`}>
          {items.map((item) => {
            const structure = item.structure;

            let canEdit = session?.user?.role === "Admin";
            if (!canEdit) {
              canEdit =
                item.personneId === session?.user?.id && rolesById[item.role] === "Createur";
            }

            let str_role;
            if (pathname.includes("account/") && pathname !== `account/${userId}`) {
              const nomRole = rolesById[item.role] ?? "";
              str_role = `Cette personne est ${nomRole} de cette structure`;
            }

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