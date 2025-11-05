"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Topbar from "@/components/Topbar.jsx";
import ListLocalisation from "./components/show-localisation";
import Style from "./page.module.css";

export default function StructureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/structures/${params.id}`);
        
        if (!response.ok) {
          throw new Error("Structure non trouvée");
        }
        
        const data = await response.json();
        setStructure(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStructure();
    }
  }, [params.id]);

  // Fonction pour vérifier les permissions
  const canEdit = () => {
    if (!session || !structure) return false;
    return session.user.role === "Admin" || session.user.structure === structure.id;
  };

  // Navigation propre vers l'édition
  const handleEdit = () => {
    router.push(`/structure/${params.id}/edit`);
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <div className={Style.loading}>
            <p>Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <h1>Erreur</h1>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push("/structure")}
          >
            Retour aux structures
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Topbar />
      <div className={Style.userPage}>
        {/* En-tête avec titre et actions */}
        
        <div className={Style.header}>


          <div className={Style.header_top}>
            <a 
              className={`${Style.btn_back} btn btn-outline-success`}
              href="/structure"
              title="Retour"
            >
              <i className="bi bi-arrow-left"></i> Retour
            </a>
            {canEdit() && (
            <button 
              className={`${Style.btn_crud} btn btn-outline-primary`}
              onClick={handleEdit}
              title="Modifier la structure"
            >
              <span>Modifier</span>
              <i className="bi bi-pencil"></i>
            </button>
          )}

          </div>

            <h1>{structure?.nomStructure || "Structure inconnue"}</h1>
          
        </div>

        {/* Section Description */}
        <div className={Style.desc_content}>
          <h2>Description</h2>
          {structure?.description ? (
            <p>{structure.description}</p>
          ) : (
            <p className={Style.noData}>Aucune description disponible</p>
          )}
          
          {structure?.dateCreation && (
            <p className={Style.metaInfo}>
              <i className="bi bi-calendar"></i>
              <strong>Date de création :</strong>{" "}
              {new Date(structure.dateCreation).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </p>
          )}

          {/* Départements */}
          {structure?.departements && structure.departements.length > 0 && (
            <div className={Style.departements_section}>
              <h3>Départements</h3>
              <ul className={Style.loc_list}>
                {structure.departements.map(item => (
                  <ListLocalisation 
                    key={item.id}
                    id={item.departementId}
                    nomDepartement={item.nom}
                  />
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Section Cartes */}
        <div className={Style.conteneur}>
          <a 
            href={`/structure/${params.id}/articles`} 
            className={Style.card}
          >
            <img src="/images/default-article.png" alt="Articles" />
            <h2>Articles</h2>
            <p className={Style.cardCount}>
              {structure?.articlesCount || 0} article{structure?.articlesCount > 1 ? 's' : ''}
            </p>
          </a>

          {/* Décommentez ces cartes si nécessaire */}
          {/* 
          <a 
            href={`/structure/${params.id}/localisations`} 
            className={Style.card}
          >
            <img src="/images/localisation.png" alt="Localisations" />
            <h2>Localisations</h2>
            <p className={Style.cardCount}>
              {structure?.localisationsCount || 0} localisation{structure?.localisationsCount > 1 ? 's' : ''}
            </p>
          </a>

          <a 
            href={`/structure/${params.id}/parametres`} 
            className={Style.card}
          >
            <img src="/images/parametres.png" alt="Paramètres" />
            <h2>Paramètres</h2>
            <p>Configuration de la structure</p>
          </a>
          */}
        </div>
      </div>
    </>
  );
}