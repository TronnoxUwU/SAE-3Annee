import { deserializeComposant } from "./composantDeserializer";

export const deserializeArticle = (data: any) => ({
  titre: data.titre,
  composants: {
    create: data.composants.map(deserializeComposant),
  },
  documents: data.documents
    ? {
        create: data.documents.map((doc: any) => ({
          lien: doc.lien,
        })),
      }
    : undefined,
});