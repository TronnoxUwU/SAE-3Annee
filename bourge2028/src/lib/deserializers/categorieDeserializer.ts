import type { Prisma } from "@prisma/client";

interface SerializedCategorie {
  id?: number;
  nom: string;
  parentId?: number | null;
  tags?: { id: number }[];
  children?: SerializedCategorie[];
}

export const deserializeCategorie = (
  data: SerializedCategorie
): Prisma.CategorieCreateInput | Prisma.CategorieUpdateInput => {
  const { nom, parentId, tags, children } = data;

  const deserialized: Prisma.CategorieCreateInput = {
    nom,
    parent: parentId ? { connect: { id: parentId } } : undefined,
    tags: tags?.length
      ? {
          connect: tags.map(tag => ({ id: tag.id })),
        }
      : undefined,
    children: children?.length
      ? {
          create: children.map(child => deserializeCategorie(child) as Prisma.CategorieCreateInput),
        }
      : undefined,
  };

  return deserialized;
};
