import type { Carte, Categorie } from "@prisma/client";

export const serializeCarte = (
  carte: Carte & {
    categories?: Categorie[]
  }
) => ({
  id: carte.id,
  titre: carte.titre,
  descriptionCarte: carte.descriptionCarte,
  lienCarte: carte.lienCarte,
  categories: carte.categories?.map(categorie => ({
      id: categorie.id,
      nom: categorie.nom,
  })) || [],
});