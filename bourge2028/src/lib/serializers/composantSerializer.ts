import type {
  Composant,
  Paragraphe,
  Titre,
  Image,
  Caroussel,
} from "@prisma/client";
import { serializeParagraphe } from "./paragrapheSerializer";
import { serializeTitre } from "./titreSerializer";
import { serializeImage } from "./imageSerializer";
import { serializeCaroussel } from "./carousselSerializer";

export const serializeComposant = (
  c: Composant & {
    paragraphe?: Paragraphe | null;
    titre?: Titre | null;
    image?: Image | null;
    caroussels?: (Caroussel & { images?: Image[] })[];
  }
) => {
  const result: any = {
    id: c.id,
    positionComposant: c.positionComposant,
    type: c.type, // 👈 pris directement du modèle
    articleId: c.articleId,
  };

  if (c.titre) result.titre = serializeTitre(c.titre);
  if (c.paragraphe) result.paragraphe = serializeParagraphe(c.paragraphe);
  if (c.image) result.image = serializeImage(c.image);
  if (c.caroussels && c.caroussels.length > 0)
    result.caroussels = c.caroussels.map(serializeCaroussel);

  return result;
};