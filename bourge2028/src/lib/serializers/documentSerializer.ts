import type { Document } from "@prisma/client";

export const serializeDocument = (doc: Document) => ({
  id: doc.id,
  lien: doc.lien,
});