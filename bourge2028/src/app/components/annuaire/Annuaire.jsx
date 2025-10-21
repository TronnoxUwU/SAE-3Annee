import ApercuArticle from "./ApercuArticle";
import "../../styles/annuaire.css";

// Exemple de données d'articles: { id, nom, 1ere image }
const articles = [
  { id: 1, title: "Article 1", image: "/images/map-remplacement.png" },
  { id: 2, title: "Article 2", image: "/images/tete.png" },
  { id: 3, title: "Article 3", image: "/images/tete.png" },
  { id: 4, title: "Article 4", image: "/images/map-remplacement.png" },
];

export default function Annuaire() {
  return (
    <div className="annuaire">
      {articles.map((article) => (
        <ApercuArticle key={article.id} article={article} />
      ))}
    </div>
  );
}
