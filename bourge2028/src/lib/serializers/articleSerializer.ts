import type { Article, Composant, Document } from "@prisma/client";
import { serializeComposant } from "./composantSerializer";
import { serializeDocument } from "./documentSerializer";

export const serializeArticle = (
  article: Article & {
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
  composants: article.composants?.map(serializeComposant) || [],
  documents: article.documents?.map(serializeDocument) || [],
});