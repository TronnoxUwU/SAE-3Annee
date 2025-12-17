import { Prisma } from "@prisma/client";
import { deserializeCategorie } from "./categorieDeserializer";

export const deserializeStructure = (
  data: any
): Prisma.StructureCreateInput | Prisma.StructureUpdateInput => {
  const {
    nomStructure,
    nomStructSearch,
    dateCreation,
    description,
    departements,
    adresse,
    waiting,
    cats,
    latitude,
    longitude,
    personnes,
    realisations,
  } = data;

  console.log(data)

  const deserialized: Prisma.StructureCreateInput = {
    nomStructure,
    nomStructSearch: nomStructure.toLowerCase(),
    dateCreation: dateCreation ? new Date(dateCreation) : undefined,
    description,
    adresse,
    waiting,

    departements: departements?.length
    //   ? { connect: { id: departementId } }
      ? { connect: departements.map((d: any) => ({ id: d.id })),}
      : undefined,

    cats:{
      create: cats.map(deserializeCategorie),
    },

    latitude: latitude,
    longitude: longitude,

    personnes: personnes?.length
      ? { connect: personnes.map((p: any) => ({ id: p.id })),}
      : undefined,

    realisations: realisations?.length
      ? { connect: realisations.map((r: any) => ({ id: r.id })),}
      : undefined,
  };

  return deserialized;
};
