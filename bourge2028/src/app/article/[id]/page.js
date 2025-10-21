"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import "../../styles/article.css";
import styles from "../../styles/carousel-article.module.css";
import Topbar from "@/components/Topbar.jsx";

export default function ArticlePage() {
  const { id } = useParams(); // ✅ récupère automatiquement l'id depuis /article/[id]
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
        console.log(data);
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
      <div className="article-page">
        <h1>{article.titre}</h1>
        {article.composants.map((elt, i) => {
          switch (elt.type) {
            case "titre":
              return <h2 key={i}>{elt.titre.texteTitre}</h2>;

            case "paragraphe":
              return <p key={i}>{elt.paragraphe.texteParagraphe}</p>;

            case "image":
              return (
                <img
                  key={i}
                  src={elt.image.lienImage}
                  alt={elt.image.titreImage || ""}
                  className="article-image"
                />
              );

            case "caroussel":
              return (
                <Carousel
                  showArrows={true}
                  showIndicators={true}
                  infiniteLoop={true}
                  dynamicHeight={false} // garde false pour ne pas que react calcule la hauteur
                  className={styles.mySwiper}
                  renderThumbs={() => null} // supprime les miniatures
                >
                  {elt.caroussels[0].images.map((img) => (
                    <img
                      key={img.id}
                      src={img.lienImage}
                      alt={img.titreImage || ""}
                      className={styles["article-image"]}
                    />
                  ))}
                </Carousel>

              );

            default:
              return null;
          }
        })}
        {article.documents.length > 0 && (
          <section className="article-documents">
            <h3>Documents associés :</h3>
            <ul>
              {article.documents.map((doc, i) => (
                <li key={i}>
                  <a href={doc.lien} target="_blank">
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
