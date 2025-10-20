import type { Image } from "@prisma/client";

export const serializeImage = (img: Image) => ({
  id: img.id,
  lienImage: img.lienImage,
  titreImage: img.titreImage,
  copyright: img.copyright,
  composantId: img.composantId,
  carousselId: img.carousselId,
});