import { Structure, Departement, Situer, StructureTag, Tag, Realisation, Appartenir } from "@prisma/client";

export const serializeStructure = (
  structure: Structure & {
    // departements?: Departement[];
    departements?: (Situer & { departement?: Departement | null })[];
    tags?: (StructureTag & { tag?: Tag | null })[];
    realisations?: Realisation[];
    personnes?: Appartenir[];
  }
) => ({
  id: structure.id,
  nomStructure: structure.nomStructure ?? null,
  dateCreation: structure.dateCreation ?? null,
  description: structure.description ?? null,
//   departementId: structure.departementId ?? null,

  departements: structure.departements?.map(departement => ({
    id: departement.id,
    deptId: departement.departementId,
    nom: departement.departement?.nom ?? null, 
  })) ?? [],

  tags: structure.tags?.map(tag => ({ // revoir si on modif les tags
    id: tag.id,
    tagId: tag.tagId,
    nom: tag.tag?.nom ?? null,
  })) ?? [],

  personnes: structure.personnes?.map(p => ({ // revoir ....
    id: p.id,
    personneId: p.personneId,
    role: p.role,
  })) ?? [],

  realisations: structure.realisations?.map(r => ({ // revoir ....
    id: r.id,
    nom: r.nom,
  })) ?? [],
});
