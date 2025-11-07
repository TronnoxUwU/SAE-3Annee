import type { Categorie} from "@prisma/client";


export const serializeCategorie = (
  categorie: Categorie & {
    children?: (Categorie & {
      children?: Categorie[];
    })[] | undefined;
  }
) => ({
  id: categorie.id,
  nom: categorie.nom,
  parentId: categorie.parentId ?? null,
  children: categorie.children?.map(serializeCategorie) || [],
});
