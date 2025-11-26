import type { Carte, Categorie } from "@prisma/client";
import { serializeCategorie } from "./categorieSerializer";

export const serializeCarte = (
  carte: Carte & {
    categories?: Categorie[]
  }
) => ({
  id: carte.id,
  titre: carte.titre,
  descriptionCarte: carte.descriptionCarte,
  lienCarte: carte.lienCarte,
  categories: carte.categories?.map(categorie => 
      serializeCategorie(categorie)
  ) || [],
});