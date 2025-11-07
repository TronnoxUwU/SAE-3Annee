import { Prisma } from "@prisma/client";

export const deserializePersonne = (
  data: any
): Prisma.PersonneCreateInput | Prisma.PersonneUpdateInput => {
  const {
    identifiant,
    nom,
    prenom,
    email,
    description,
    password,
    dateCreation,
    role,
    departement,
    structures,
    redactions,
  } = data;

  console.log(data)

  const deserialized: Prisma.PersonneCreateInput = {
    identifiant,
    nom,
    prenom,
    email,
    description,
    password,
    dateCreation: dateCreation ? new Date(dateCreation) : undefined,
    role,

    departement: departement
      ? { connect: { id: departement } }
      : undefined,

    structures: structures?.length
      ? { connect: structures.map((s: any) => ({ id: s.id })),}
      : undefined,

    redactions: redactions?.length
      ? { connect: redactions.map((r: any) => ({ id: r.id })),}
      : undefined,
  };

  return deserialized;
};
