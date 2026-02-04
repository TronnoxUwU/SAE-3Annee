"use client";

import ApercuArticle from "./ApercuArticle";
import ApercuCarte from "./ApercuCarte";
import ApercuRealisation from "./ApercuRealisation";
import styles from "./annuaire.module.css";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
export default function Annuaire({ articles }) {
  const { data: session } = useSession();
  const router = useRouter();

  // 🔐 DROIT D'ÉDITION POUR UNE RÉALISATION
  const canEdit = (realisation) => {
    if (!session || !realisation || !realisation.structure) return false;

    // Admin → OK
    if (session.user.role === "Admin") return true;

    // Membre d’une structure du projet → OK
    return realisation.structure?.some(
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

  // const getTypeLabel = (item) => {
  //   if (item.lienCarte) return "Cartes";
  //   if (!item.projet) return "Réalisations";
  //   return "Articles";
  // };


  if (!articles?.length) {
    return <p>Aucun élément trouvé.</p>;
  }

  /* ===== CARTES ===== */
  if (articles[0].lienCarte) {
    return (
      <div className={styles.bloc_annuaire}>
        <div className={styles.titre_annuaire}>Cartes annexes</div>
        <div className={styles.annuaire}>
          {articles.map((article) => {
            if (article.waiting) return null;
            return <ApercuCarte key={article.id} article={article} />
          })}
        </div>
      </div>
    )
  }

  /* ===== RÉALISATIONS ===== */
  if (!articles[0].projet) {
    // console.log(articles);
    return (
      <div className={styles.bloc_annuaire}>
        <div className={styles.titre_annuaire}>Projets</div>
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
