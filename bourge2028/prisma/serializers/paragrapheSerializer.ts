import type { Paragraphe } from "@prisma/client";

export const serializeParagraphe = (p: Paragraphe) => ({
  id: p.id,
  texteParagraphe: p.texteParagraphe,
  composantId: p.composantId,
});