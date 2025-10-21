import type { Caroussel, Image } from "@prisma/client";
import { serializeImage } from "./imageSerializer";

export const serializeCaroussel = (
  caroussel: Caroussel & { images?: Image[] }
) => ({
  id: caroussel.id,
  titreCaroussel: caroussel.titreCaroussel,
  composantId: caroussel.composantId,
  images: caroussel.images?.map(serializeImage) || [],
});