"use client";

import ApercuArticle from "./ApercuArticle";
import ApercuCarte from "./ApercuCarte";
import ApercuRealisation from "./ApercuRealisation";
import styles from "../../styles/annuaire.module.css";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
export default function Annuaire({ articles }) {
  const { data: session } = useSession();
  const router = useRouter();

  // 🔐 DROIT D'ÉDITION POUR UNE RÉALISATION
  const canEdit = (realisation) => {
    if (!session || !realisation) return false;

    // Admin → OK
    if (session.user.role === "Admin") return true;

    // Membre d’une structure du projet → OK
    return realisation.structure.some(
      (struct) => struct.id === session.user.structure
    );
  };

  // 🗑️ SUPPRESSION D’UNE RÉALISATION
  const handleDeleteRealisation = async (realisationId) => {
    try {
      const res = await fetch(
        `/api/realisations/${realisationId}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error();

      alert("Réalisation supprimée");
      // 👉 soit refetch côté parent
      router.refresh()
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la réalisation");
    }
  };

  if (!articles?.length) {
    return <p>Aucun élément trouvé.</p>;
  }

  /* ===== CARTES ===== */
  if (articles[0].lienCarte) {
    return <div className={styles.annuaire}>
      {articles.map((article) => {
        if (article.waiting) return null;
        return <ApercuCarte key={article.id} article={article} />
      })}
    </div>
  }

  /* ===== RÉALISATIONS ===== */
  if (!articles[0].projet) {
    return (
      <div className={styles.annuaire}>
        {articles.map((realisation) => (
          <ApercuRealisation
            key={realisation.id}
            article={realisation}
            editable={canEdit(realisation)}
            onDelete={handleDeleteRealisation}
          />
        ))}
      </div>
    );
  }

  /* ===== ARTICLES ===== */
  return (
    <div className={styles.annuaire}>
      {articles.map((article) => (
        <ApercuArticle key={article.id} article={article} />
      ))}
    </div>
  );
}
