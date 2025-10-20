import type { Document, Contenir } from "@prisma/client";
import { serializeContenir } from "./contenirSerializer";

export const serializeDocument = (
  doc: Document & { contenirs?: (Contenir & { document: Document })[] }
) => ({
  id: doc.id,
  lien: doc.lien,
  contenirs: doc.contenirs?.map(serializeContenir) || [],
});