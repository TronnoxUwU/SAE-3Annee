import type { Contenir, Document } from "@prisma/client";
import { serializeDocument } from "./documentSerializer";

export const serializeContenir = (
  c: Contenir & { document: Document }
) => ({
  id: c.id,
  document: serializeDocument(c.document),
});