import { deserializeComposant } from "./composantDeserializer";

export const deserializeArticle = (data: any) => ({
  composants: {
    create: data.composants.map(deserializeComposant),
  },
});