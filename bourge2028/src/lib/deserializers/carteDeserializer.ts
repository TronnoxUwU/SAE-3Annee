import { Prisma } from "@prisma/client";

export const deserializeCarte = (
  data: any
): Prisma.CarteCreateInput | Prisma.CarteUpdateInput => {
  const { titre, descriptionCarte, lienCarte, categories, waiting } = data;

  const deserialized: Prisma.CarteCreateInput = {
    titre,
    descriptionCarte,
    lienCarte,
    waiting,
    categories: categories?.length
      ? { connect: categories.map((c: any) => ({ id: c.id })) }
      : undefined,
  };

  return deserialized;
};
