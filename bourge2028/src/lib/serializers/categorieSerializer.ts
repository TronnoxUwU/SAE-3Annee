import type { Categorie, Tag } from "@prisma/client";


export const serializeCategorie = (
  categorie: Categorie & {
    children?: (Categorie & {
      children?: Categorie[];
      tags?: Tag[];
    })[];
    tags?: Tag[];
  }
) => ({
  id: categorie.id,
  nom: categorie.nom,
  parentId: categorie.parentId ?? null,
  tags: categorie.tags?.map(tag => ({
    id: tag.id,
    nom: tag.nom,
  })) || [],
  children: categorie.children?.map(serializeCategorie) || [],
});
