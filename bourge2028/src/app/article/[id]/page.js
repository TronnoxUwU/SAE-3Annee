"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/article.css";
import Topbar from "@/app/components/Topbar";

export default function ArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Données fictives
    const data = {
      "id": 15,
      "composants": [
        {
          "id": 66,
          "positionComposant": 1,
          "type": "titre",
          "articleId": 15,
          "titre": {
            "id": 15,
            "niveauTitre": 1,
            "texteTitre": "Hello world",
            "composantId": 66
          }
        },
        {
          "id": 67,
          "positionComposant": 2,
          "type": "image",
          "articleId": 15,
          "image": {
            "id": 17,
            "lienImage": "/images/tete.png",
            "titreImage": "illustration de tête",
            "copyright": "",
            "composantId": 67,
            "carousselId": null
          }
        },
        {
          "id": 68,
          "positionComposant": 3,
          "type": "paragraphe",
          "articleId": 15,
          "paragraphe": {
            "id": 29,
            "texteParagraphe": "blabla",
            "composantId": 68
          }
        },
        {
          "id": 69,
          "positionComposant": 4,
          "type": "paragraphe",
          "articleId": 15,
          "paragraphe": {
            "id": 30,
            "texteParagraphe": "blabla",
            "composantId": 69
          }
        },
        {
          "id": 70,
          "positionComposant": 5,
          "type": "caroussel",
          "articleId": 15,
          "caroussels": [
            {
              "id": 8,
              "titreCaroussel": "Galerie d’images",
              "composantId": 70,
              "images": [
                {
                  "id": 18,
                  "lienImage": "/images/tete.png",
                  "titreImage": "illustration de tête",
                  "copyright": "",
                  "composantId": 71,
                  "carousselId": 8
                }, {
                  "id": 19,
                  "lienImage": "/images/map-remplacement.png",
                  "titreImage": "illustration de carte",
                  "copyright": "",
                  "composantId": 72,
                  "carousselId": 8
                }
              ]
            }
          ]
        }
      ],
      "documents": [
        { "lien": "https://example.com/document1.pdf" },
        { "lien": "https://example.com/document2.pdf" }
      ]
    };

    setArticle(data);
  }, []);

  if (!article) return <p>Chargement...</p>;

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
                <div key={i} className="article-caroussel">
                  {elt.caroussels[0].images.map((img, j) => (
                    <img
                      key={j}
                      src={img.lienImage}
                      alt={img.titreImage || ""}
                      className="article-image"
                    />
                  ))}
                </div>
              );

            default:
              return null;
          }
        })}
      </div>
    </>
  );
}
