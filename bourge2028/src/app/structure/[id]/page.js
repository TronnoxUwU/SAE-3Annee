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

  function renderDate(date){
    if (!date) return "Date de fondation inconnue";

    const d = new Date(date);
    if (isNaN(d.getTime())) return "Date invalide";

    return `${d.toLocaleDateString('fr-FR', {
        year: "numeric",
        month: "long",
        day: "numeric"
    })}`;
  }

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

  const canEdit = () => {
    if (!session || !structure) return false;
    return session.user.role === "Admin" || session.user.structure === structure.id;
  };

  const handleEdit = () => {
    router.push(`/structure/${params.id}/edit`);
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="text-center">
              <div className="spinner-border text-secondary mb-3" role="status">
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
        <Topbar />
        <div className={Style.userPage}>
          <h2>Erreur</h2>
          <p>{error}</p>
          <button 
            className="btn btn-outline-secondary"
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
        
        {/* Navigation */}
        <div className={Style.navBar}>
          <a 
            className={`${Style.btn_back} btn btn-link`}
            href="/structure"
            title="Retour"
          >
            <i className="bi bi-chevron-left"></i> Retour
          </a>
          {canEdit() && (
            <button 
              className={`${Style.btn_edit} btn btn-outline-secondary`}
              onClick={handleEdit}
              title="Modifier la structure"
            >
              <i className="bi bi-pencil-square"></i> Modifier
            </button>
          )}
        </div>

        {/* Hero avec asymétrie */}
        <div className={Style.heroSection}>
          <div className={Style.heroContent}>
            <span className={Style.label}>Structure régionale depuis le {renderDate(structure.dateCreation)}</span>
            <h2 className={Style.mainTitle}>{structure?.nomStructure || "Structure inconnue"}</h2>
            
            {/* {structure?.dateCreation && (
              <p className={Style.dateInfo}>
                
              </p>
            )} */}

            <p className={Style.description}>
              {structure?.description || "Aucune description disponible"}
            </p>
          </div>

            <img
                src="/images/map-replacement-opti.jpg"
                alt="representation structure"
                className={Style.showImage}
            />
        </div>

        {/* Départements */}
        {structure?.departements && structure.departements.length > 0 && (
          <div className={Style.departementSection}>
            <span className={Style.label}>Notre présence dans la région</span>
            
            <div className={Style.departementsList}>
              {structure.departements.map((item, idx) => (
                <div 
                  key={item.id} 
                  className={`${Style.departementItem} `} //${idx % 2 === 1 ? Style.offsetRight : ''}
                >
                  {/* <div className={Style.departementDot}></div> */}
                  <i className="bi bi-pin-map"></i>
                  <span className={Style.departementName}>
                    {item.nom}
                  </span>
                  <span className={Style.departementNumber}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section Articles */}
        <div className={Style.articlesSection}>
          <a href={`/structure/${params.id}/articles`} className={Style.articlesLink}>
            <div className={Style.articlesContainer}>
              <div className={Style.articlesContent}>
                <span className={Style.label}>Ressources</span>
                <h2 className={Style.articlesTitle}>Nos réalisations</h2>
                <p className={Style.articlesDescription}>
                  Explorez notre collection de publications sur nos divers projets.
                </p>
              </div>

              <div className={Style.articlesCount}>
                <div className={Style.countBox}>
                  <span className={Style.number}>{structure?.articlesCount || 0}</span>
                  <div className={Style.countLine}></div>
                  <span className={Style.countLabel}>
                    {structure?.articlesCount > 1 ? "RESSOURCES" : "RESSOURCE"}
                  </span>
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* Footer */}
        <div className={Style.footer}>
          <span className={Style.footerLabel}>Bourges 28</span>
          <span className={Style.footerDate}>
            Réalisé par Shanka C. Baptiste R. et Tristan C.
            {/* {new Date().toLocaleDateString('fr-FR')} */}
          </span>
        </div>
      </div>
    </>
  );
}