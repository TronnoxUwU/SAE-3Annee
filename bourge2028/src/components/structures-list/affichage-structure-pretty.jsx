"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Style from "./structure-Item.module.css";
import StructureItem from "./structure-Item-pretty";

export default function Structure() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const [items, setItems] = useState([]);
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadStructures() {
    const res = await fetch("/api/structures");
    if (!res.ok) throw new Error("Structure non trouvée");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    loadStructures().catch(err => setError(err.message));
  }, []);

  /* --- LOADING --- */
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "250px" }}>
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-muted">Chargement des données...</p>
        </div>
      </div>
    );
  }

  /* --- ERREUR --- */
  if (error) {
    return (
      <div className="p-5">
        <h1 className="h3 fw-bold text-danger">Erreur</h1>
        <p className="text-muted mb-4">{error}</p>

        <button
          onClick={() => router.push("/admin")}
          className="btn btn-dark"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 bg-white min-vh-100">

      {/* --- Header --- */}
      <div className="container-fluid mb-4 d-flex justify-content-between align-items-center">
        {/* <h1 className="h2 fw-semibold text-dark">Structures</h1> */}

        {/* Toggle view */}
        <div className="btn-group border rounded bg-light">
          <button
            onClick={() => setViewMode("grid")}
            className={`btn btn-lg ${viewMode === "grid" ? "btn-white text-dark border-end" : "btn-light text-secondary"}`}
          >
            <i className="bi bi-grid-fill me-1" /> Galerie
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`btn btn-lg ${viewMode === "list" ? "btn-white text-dark" : "btn-light text-secondary"}`}
          >
            <i className="bi bi-card-list me-1" /> Liste
          </button>
        </div>
      </div>

      {/* --- GRID VIEW --- */}
      {viewMode === "grid" && (
        <div className={`${Style.grid_wrapper}`}>
          {items.map(item => {
            let canEdit = session?.user?.role === "Admin";
            if (!canEdit) {
              item.personnes?.forEach(p => {
                if (p.role === "Createur" && p.personneId === session?.user?.id) {
                  canEdit = true;
                }
              });
            }
            let str_role = null;
            if (pathname.includes("account/") && pathname !== `account/${session?.user?.id}`) {
              const r = item.personnes?.find(p => p.personneId !== session?.user?.id);
              if (r) str_role = `Cette personne est ${r.role} de cette structure`;
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
                etat={"galerie"}
              />
            );
          })}
        </div>
      )}

      {/* --- LIST VIEW --- */}
      {viewMode === "list" && (
        <ul className={Style.override_list}>
          {items.map(item => {
            let canEdit = session?.user?.role === "Admin";

            if (!canEdit) {
              item.personnes?.forEach(p => {
                if (p.role === "Createur" && p.personneId === session?.user?.id) {
                  canEdit = true;
                }
              });
            }

            let str_role = null;
            if (pathname.includes("account/") && pathname !== `account/${session?.user?.id}`) {
              const r = item.personnes?.find(p => p.personneId !== session?.user?.id);
              if (r) str_role = `Cette personne est ${r.role} de cette structure`;
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
                etat={"liste"}
              />
            );
          })}
        </ul>
      )}
    </div>
  );
}
