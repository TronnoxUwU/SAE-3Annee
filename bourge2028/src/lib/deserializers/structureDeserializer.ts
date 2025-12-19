import { Prisma } from "@prisma/client";

export const deserializeStructure = (
  data: any,
  isUpdate: boolean = false
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

  const deserialized: any = {
    nomStructure,
    nomStructSearch: nomStructure?.toLowerCase(),
    dateCreation: dateCreation ? new Date(dateCreation) : undefined,
    description,
    adresse,
    waiting: waiting ?? (isUpdate ? undefined : true),
    latitude: latitude,
    longitude: longitude,
  };

  // 🔥 Gestion spéciale des relations avec tables de jointure
  if (isUpdate) {
    // Départements
    if (departements?.length !== undefined) {
      deserialized.departements = {
        deleteMany: {},
        create: departements.map((d: any) => ({
          departement: { connect: { id: d.id } }
        }))
      };
    }

    // Catégories
    if (cats?.length !== undefined) {
      deserialized.cats = {
        deleteMany: {},
        create: cats.map((c: any) => ({
          categorie: { connect: { id: c.id } }
        }))
      };
    }

    // Personnes - ✅ Gérer le cas où roleId est undefined
    if (personnes?.length !== undefined) {
      // Filtrer les personnes qui ont un roleId valide
      const validPersonnes = personnes.filter((p: any) => p.roleId);
      
      if (validPersonnes.length > 0) {
        deserialized.personnes = {
          deleteMany: {},
          create: validPersonnes.map((p: any) => ({
            personne: { connect: { id: p.id } },
            role: { connect: { id: p.roleId } }
          }))
        };
      } else {
        // Si aucune personne valide, simplement supprimer toutes les relations
        deserialized.personnes = {
          deleteMany: {}
        };
      }
    }

    // Réalisations
    if (realisations?.length !== undefined) {
      deserialized.realisations = {
        set: realisations.map((r: any) => ({ id: r.id }))
      };
    }
  } else {
    // Pour CREATE
    if (departements?.length) {
      deserialized.departements = {
        create: departements.map((d: any) => ({
          departement: { connect: { id: d.id } }
        }))
      };
    }

    if (cats?.length) {
      deserialized.cats = {
        create: cats.map((c: any) => ({
          categorie: { connect: { id: c.id } }
        }))
      };
    }

    if (personnes?.length) {
      const validPersonnes = personnes.filter((p: any) => p.roleId);
      if (validPersonnes.length > 0) {
        deserialized.personnes = {
          create: validPersonnes.map((p: any) => ({
            personne: { connect: { id: p.id } },
            role: { connect: { id: p.roleId } }
          }))
        };
      }
    }

    if (realisations?.length) {
      deserialized.realisations = {
        connect: realisations.map((r: any) => ({ id: r.id }))
      };
    }
  }

  return deserialized;
};