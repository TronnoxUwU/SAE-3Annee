import { deserializeDocument } from "./documentDeserializer";
import { deserializeComposant } from "./composantDeserializer";

export const deserializeArticle = (data: any) => ({
  titre: data.titre,
  realisationId: data.realisationId,
  composants: {
    create: data.composants.map(deserializeComposant),
  },
  documents: {
    create: data.documents.map(deserializeDocument),
  },
});