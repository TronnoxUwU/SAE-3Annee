import { Prisma } from "@prisma/client";

export const deserializeStructure = (
  data: any
): Prisma.StructureCreateInput | Prisma.StructureUpdateInput => {
  const {
    nomStructure,
    dateCreation,
    description,
    departements,
    tags,
    personnes,
    realisations,
  } = data;

  console.log(data)

  const deserialized: Prisma.StructureCreateInput = {
    nomStructure,
    dateCreation: dateCreation ? new Date(dateCreation) : undefined,
    description,

    departements: departements?.length
    //   ? { connect: { id: departementId } }
      ? { connect: departements.map((d: any) => ({ id: d.id })),}
      : undefined,

    tags: tags?.length
      ? { connect: tags.map((t: any) => ({ id: t.id })),}
      : undefined,

    personnes: personnes?.length
      ? { connect: personnes.map((p: any) => ({ id: p.id })),}
      : undefined,

    realisations: realisations?.length
      ? { connect: realisations.map((r: any) => ({ id: r.id })),}
      : undefined,
  };

  return deserialized;
};
