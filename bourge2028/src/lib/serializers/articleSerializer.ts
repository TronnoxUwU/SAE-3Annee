import type { Article, Composant, Document, Realisation } from "@prisma/client";
import { serializeComposant } from "./composantSerializer";
import { serializeDocument } from "./documentSerializer";

export const serializeArticle = (
  article: Article & {
    titre?: any;
    composants?: (Composant & {
      paragraphe?: any;
      titre?: any;
      image?: any;
      caroussels?: any[];
    })[];
    documents?: Document[];
  }
) => ({
  id: article.id,
  titre: article.titre,
  composants: article.composants?.map(serializeComposant) || [],
  documents: article.documents?.map(serializeDocument) || [],
});