"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PersonneItem from "./personne-Item";
import style from "./personne-Item.module.css";

export default function PersonneList() {
  const router = useRouter();
  const { data: session } = useSession();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadPersonnes() {
    const res = await fetch("/api/users");
    if (!res.ok) {
      throw new Error("Comptes non trouvés");
    }
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  useEffect(() => {
    try {
      setLoading(true);
      loadPersonnes();
    } catch (err) {
      setError(err.message);
    }
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" />
          <p className="text-muted">Chargement des comptes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h1>Erreur</h1>
        <p>{error}</p>
        <button onClick={() => router.push("/admin")}>
          Retour
        </button>
      </div>
    );
  }

  return (
    <ul className={style.override_list}>
      {items.map(personne => {
        const canEdit =
          session?.user?.role === "Admin" ||
          session?.user?.id === personne.id;

        return (
          <PersonneItem
            key={personne.id}
            id={personne.id}
            nom={personne.nom}
            prenom={personne.prenom}
            email={personne.email}
            tel={personne.tel}
            description={personne.description}
            role={personne.role}
            date={personne.dateCreation}
            photo={personne.lienPhoto}
            edit={canEdit}
          />
        );
      })}
    </ul>
  );
}
