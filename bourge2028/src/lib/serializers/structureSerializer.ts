import { Structure, Departement, StructureTag, Tag, Realisation, Appartenir } from "@prisma/client";

export const serializeStructure = (
  structure: Structure & {
    departement?: Departement | null;
    tags?: (StructureTag & { tag?: Tag | null })[];
    realisations?: Realisation[];
    personnes?: Appartenir[];
  }
) => ({
  id: structure.id,
  nomStructure: structure.nomStructure ?? null,
  dateCreation: structure.dateCreation ?? null,
  description: structure.description ?? null,
  departementId: structure.departementId ?? null,

  departement: structure.departement // revoir avec departement
    ? {
        id: structure.departement.id,
        nom: structure.departement.nom, 
      }
    : null,

  tags: structure.tags?.map(tag => ({ // revoir avec les tags
    id: tag.id,
    tagId: tag.tagId,
    nom: tag.tag?.nom ?? null,
  })) ?? [],

  personnes: structure.personnes?.map(p => ({ // revoir avec les personnes
    id: p.id,
    personneId: p.personneId,
    role: p.role,
  })) ?? [],

  realisations: structure.realisations?.map(r => ({ // revoir avec les trucs des structures (jsp mdr)
    id: r.id,
    nom: r.nom,
  })) ?? [],
});
