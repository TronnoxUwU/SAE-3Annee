import type { Article, Composant, Contenir, Document } from "@prisma/client";
import { serializeComposant } from "./composantSerializer";
import { serializeContenir } from "./contenirSerializer";

export const serializeArticle = (
  article: Article & {
    composants?: (Composant & {
      paragraphe?: any;
      titre?: any;
      image?: any;
      caroussels?: any[];
    })[];
    contenir?: (Contenir & { document: Document })[];
  }
) => ({
  id: article.id,
  composants: article.composants?.map(serializeComposant) || [],
  contenir: article.contenir?.map(serializeContenir) || [],
});