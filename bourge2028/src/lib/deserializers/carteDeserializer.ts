import { Prisma } from "@prisma/client";

export const deserializeCarte = (
  data: any
): Prisma.CarteCreateInput | Prisma.CarteUpdateInput => {
  const { titre, descriptionCarte, lienCarte, categories } = data;

  const deserialized: Prisma.CarteCreateInput = {
    titre,
    descriptionCarte,
    lienCarte,

    categories: categories?.length
      ? { connect: categories.map((c: any) => ({ id: c.id })) }
      : undefined,
  };

  return deserialized;
};
