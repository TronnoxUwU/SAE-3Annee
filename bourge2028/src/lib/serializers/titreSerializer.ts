import type { Titre } from "@prisma/client";

export const serializeTitre = (t: Titre) => ({
  id: t.id,
  niveauTitre: t.niveauTitre,
  texteTitre: t.texteTitre,
  composantId: t.composantId,
});