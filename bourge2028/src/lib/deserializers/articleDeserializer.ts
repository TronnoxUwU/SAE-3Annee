import { deserializeComposant } from "./composantDeserializer";

export const deserializeArticle = (data: any) => ({
  composants: {
    create: data.composants.map(deserializeComposant),
  },  
  contenir: data.documents
    ? {
        create: data.documents.map((doc: any) => ({
          document: {
            create: {
              lien: doc.lien,
            },
          },
        })),
      }
    : undefined,
});