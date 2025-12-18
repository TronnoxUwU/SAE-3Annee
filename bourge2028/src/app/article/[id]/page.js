"use client";

import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "../../styles/article.module.css";
import Topbar from "@/components/Topbar.jsx";
import CenteredCarousel from "../../components/CenteredCarousel.jsx";
import ArticleImage from "../../components/ArticleImage.jsx";


export default function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error(`Erreur ${res.status}`);
        const data = await res.json();
        setArticle(data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger l’article.");
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>{error}</p>;
  if (!article) return <p>Aucun article trouvé.</p>;

  return (
    <>
      <Topbar />
      <div className={styles.articlePage}>
        <a
          href="/annuaires/projets/"
          title="Retour"
          className="btn btn-link d-inline-flex align-items-center gap-1 fw-semibold text-dark text-decoration-none"
        >
          <i className="bi bi-chevron-left"></i>
          Retour
        </a>
        <h1>{article.titre}</h1>

        {article.composants.map((elt, i) => {
          switch (elt.type) {
            case "titre": {
              const niveau = Math.min(Math.max(elt.titre.niveauTitre || 2, 2), 6);
              const TitreTag = `h${niveau}`;
              return <TitreTag key={i}>{elt.titre.texteTitre}</TitreTag>;
            }

            case "paragraphe": {
              const safeHTML = DOMPurify.sanitize(
                elt.paragraphe.texteParagraphe,
                { ALLOWED_TAGS: ["b", "strong", "i", "em", "u", "br"] }
              );
              return <p key={i}>{parse(safeHTML)}</p>;
            }

            case "image": {
              const src = elt.image?.lienImage || "/images/default-article.png";
              const alt = elt.image?.titreImage || "";
              return (
                <ArticleImage
                  key={i}
                  src={src}
                  alt={alt}
                  className={styles.articleImage}
                  timeout={4000}
                />
              );
            }

            case "caroussel": {
              const images = [...(elt.caroussels?.[0]?.images || [])]
                .reverse()
                .map((img) => ({
                  src: img.lienImage || "/images/default-article.png",
                  alt: img.titreImage || "",
                  caption: img.titreImage || "",
                }));

              return (
                <div key={i}>
                  <CenteredCarousel images={images} />
                </div>
              );
            }

            default:
              return null;
          }
        })}

        {article.documents?.length > 0 && (
          <section className={styles.articleDocuments}>
            <h3>Documents associés :</h3>
            <ul>
              {article.documents.map((doc, i) => (
                <li key={i}>
                  <a href={doc.lien} target="_blank" rel="noreferrer">
                    {doc.lien || "Document sans nom"}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </>
  );
}
