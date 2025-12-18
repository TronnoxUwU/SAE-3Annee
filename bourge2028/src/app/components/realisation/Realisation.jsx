"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import ApercuArticle from "@/app/components/annuaire/ApercuArticle";
import { match } from "assert";
import { useSession } from "next-auth/react";
import StructureItem from "@/components/structures-list/structure-Item-pretty";

export default function ProjetView({ id, type }) {
  const [data, setData] = useState(null);
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();

  const handleDeleteArticle = async (articleId) => {
    try {
      const res = await fetch(
        `http://localhost:3000/api/articles/${articleId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      // Mise à jour du state local (sans reload)
      setData((prev) => ({
        ...prev,
        realisation: {
          ...prev.realisation,
          articles: prev.realisation.articles.filter(
            (article) => article.id !== articleId
          ),
        },
      }));
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer l’article");
    }
  };


  useEffect(() => {
    async function load() {
      try {
        let res;
        switch (type) {
          case "projet":
            res = await fetch(`http://localhost:3000/api/projets/${id}`);
            break; // pas de return
          default :
            res = await fetch(`http://localhost:3000/api/techniques/${id}`);
            break;
        }
        
        const json = await res.json();
        setData(json);
        if (res.status === 404) {
          router.push("/404"); // ou router.replace("/404")
          return;
        }
      } catch (err) {
        console.error("Erreur fetch:", err);
      }
    }
    load();
  }, [id]);

  if (!data) return <div className="text-center mt-5">Chargement...</div>;

  const canEdit = () => {
    if (!session || !data.realisation.structure?.length) return false;

    // Si Admin → accès
    if (session.user.role === "Admin") return true;

    // Sinon, vérifier si l'utilisateur fait partie d'une des structures
    const userStructureId = session.user.structure;
    return data.realisation.structure.some(
      (struct) => struct.id === userStructureId
    );
  };

  const collaborateurs = data.realisation.structure || [];
  const articles = data.realisation.articles || [];

  let str_role = null;
  if (pathname.includes("account/") && pathname !== `account/${session?.user?.id}`) {
    const r = item.personnes?.find(p => p.personneId !== session?.user?.id);
    if (r) str_role = `Cette personne est ${r.role} de cette structure`;
  }


  return (
    <div style={{ minHeight: "100vh", paddingBottom: 60 }}>
      <a
        href="/annuaires/projets/"
        title="Retour"
        className="btn btn-link d-inline-flex align-items-center gap-1 fw-semibold text-dark text-decoration-none"
      >
        <i className="bi bi-chevron-left"></i>
        Retour
      </a>

      <div
        className="container mt-5 p-4"
        style={{ background: "white", borderRadius: 12 }}
      >
        <div className="row">
          <div className="col-md-5">
            <div
              className="d-flex justify-content-center align-items-center"
              style={{
                height: 350,
                borderRadius: 20,
                color: "black",
                fontSize: 80,
              }}
            >
              🖼️
            </div>
          </div>

          <div className="col-md-7">
            <h1 className="fw-bold mt-3 mt-md-0">{data.nomProjet}</h1>
            <p>{data.realisation.description || "Aucune description disponible."}</p>
          </div>
        </div>

        {/* ARTICLES */}
        {((articles.length > 0)|| canEdit())  && (
          <>
            <h2 className="text-center fw-bold mt-5">
              À propos de ce projet :
            </h2>

            <div className="mt-4 row g-3 gap-4">
                {articles.map((article) => (
                  <ApercuArticle key={article.id} article={article} editable={canEdit()} onDelete={handleDeleteArticle}/>
                ))}

            {canEdit() && (
              <div className="col-md-3">
                <div
                  className="card h-100 d-flex justify-content-center align-items-center"
                  style={{
                    cursor: "pointer",
                    border: "2px dashed #0d6efd",
                    borderRadius: 12,
                    minHeight: 220,
                  }}
                  onClick={() => {
                    router.push(`${data.realisation.id}/article`);
                  }}
                >
                  <div
                    className="d-flex justify-content-center align-items-center"
                    style={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      background: "#0d6efd",
                      color: "white",
                      fontSize: 40,
                      fontWeight: "bold",
                    }}
                  >
                    +
                  </div>
                  <p className="mt-3 fw-semibold text-primary">
                    Ajouter un article
                  </p>
                </div>
              </div>
            )}
            </div>
          </>
        )}

        {/* COLLABORATEURS */}
        {collaborateurs.length > 0 && (
          <h2 className="text-center fw-bold mt-5">Les collaborateurs</h2>
        )}


        <div className="row mt-4">
          {collaborateurs.map((struct) => (
              <StructureItem
                key={struct.id}
                id={struct.id}
                nom={struct.nomStructure}
                date={struct.dateCreation}
                description={struct.description}
                edit={canEdit}
                role={str_role}
                etat={"galerie"}
              />
          ))}
        </div>

      </div>
    </div>
  );
}
