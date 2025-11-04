"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Topbar from "@/components/Topbar.jsx";
import ListLocalisation from "./components/show-localisation";
import Style from "./page.module.css";

export default function StructureDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [structure, setStructure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        setLoading(true);
        // Remplacez cette URL par votre endpoint API
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

  if (loading) {
    return (
      <>
        <Topbar />
        <div className={Style.userPage}>
          <p>Chargement...</p>
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
          <button onClick={() => router.push("/structure")}>
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
        {/* <button onClick={() => router.back()} style={{ marginBottom: "20px" }}>
                    ← Retour
                </button> */}

        <h1>{structure?.nomStructure || "Structure inconnue"}</h1>

        <div className={`${Style.desc_content}`}>
          <h2>Description</h2>
          {structure?.description && (<p>{structure.description}</p>)}
          {structure?.dateCreation && (
            <p><strong>Date de création:</strong> {new Date(structure.dateCreation).toLocaleDateString('fr-FR')}</p>
          )}
          {structure?.departements && (
            <ul className={`${Style.loc_list}`}>
              {structure.departements.map(item => (
                <ListLocalisation 
                  key={item.id}
                  id={item.departementId}
                  nomDepartement={item.nom}
                />
              ))
              }
            </ul>
          )}
        </div>

        {/* <div className={Style.conteneur}> */}
        <div>


          <a href={`/structure/${params.id}/articles`} className={Style.card}>
            <img src="/images/default-article.png" alt="Articles" />
            <h2>Articles</h2>
            <p>{structure?.articlesCount || 0} articles</p>
          </a>

          {/* <a href={`/structure/${params.id}/localisations`} className={Style.card}>
                        <img src="/images/localisation.png" alt="Localisations" />
                        <h2>Localisations</h2>
                        <p>{structure?.localisationsCount || 0} localisations</p>
                    </a> */}

          {/* <a href={`/structure/${params.id}/parametres`} className={Style.card}>
                        <img src="/images/parametres.png" alt="Paramètres" />
                        <h2>Paramètres</h2>
                        <p>Configuration de la structure</p>
                    </a> */}
        </div>


      </div>
    </>
  );
}