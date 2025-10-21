"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "../../styles/article.css";

export default function ArticlePage() {
  const router = useRouter();
  const [article, setArticle] = useState(null);

  useEffect(() => {
    // Données fictives
    const data = {
      id: 1,
      titre: "Mon premier article",
      composants: [
        {
          id: 1,
          positionComposant: 1,
          type: "titre",
          articleId: 1,
          titre: {
            id: 1,
            niveauTitre: 1,
            texteTitre: "Bienvenue sur mon article",
            composantId: 1,
          },
        },
        {
          id: 2,
          positionComposant: 2,
          type: "image",
          articleId: 1,
          image: {
            id: 1,
            lienImage: "/images/map-remplacement.png",
            titreImage: "Illustration d’exemple",
            copyright: "",
            composantId: 2,
            carousselId: null,
          },
        },
        {
          id: 3,
          positionComposant: 3,
          type: "paragraphe",
          articleId: 1,
          paragraphe: {
            id: 1,
            texteParagraphe:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
            composantId: 3,
          },
        },
        {
          id: 4,
          positionComposant: 4,
          type: "paragraphe",
          articleId: 1,
          paragraphe: {
            id: 2,
            texteParagraphe:
              "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
            composantId: 4,
          },
        },
        {
          id: 5,
          positionComposant: 5,
          type: "titre",
          articleId: 1,
          titre: {
            id: 1,
            niveauTitre: 1,
            texteTitre: "Bienvenue sur mon article",
            composantId: 5,
          },
        },
        {
          id: 6,
          positionComposant: 6,
          type: "paragraphe",
          articleId: 1,
          paragraphe: {
            id: 3,
            texteParagraphe:
              "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
            composantId: 6,
          },
        },
        {
          id: 7,
          positionComposant: 7,
          type: "paragraphe",
          articleId: 1,
          paragraphe: {
            id: 4,
            texteParagraphe:
              "Curabitur sodales ligula in libero. Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam.",
            composantId: 7,
          },
        },
        {
          id: 7,
          positionComposant: 7,
          type: "paragraphe",
          articleId: 1,
          paragraphe: {
            id: 5,
            texteParagraphe:
              "In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.",
            composantId: 7,
          },
        },
      ],
      contenir: [],
    };

    setArticle(data);
  }, []);

  if (!article) return <p>Chargement...</p>;

  return (
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

          default:
            return null;
        }
      })}
    </div>
  );
}
