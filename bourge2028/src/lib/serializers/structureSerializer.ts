import {
  Structure,
  Departement,
  Situer,
  StructureCat,
  Categorie,
  Realisation,
  Appartenir,
} from "@prisma/client";
import { serializeDepartement } from "./departementSerializer";
import { serializeCategorie } from "./categorieSerializer";

export const serializeStructure = (
  structure: Structure & {
    departements?: (Situer & { departement?: Departement | null })[];
    cats?: Categorie[];
    realisations?: Realisation[];
    personnes?: Appartenir[];
  }
) => ({
  id: structure.id,
  nomStructure: structure.nomStructure ?? null,
  dateCreation: structure.dateCreation ?? null,
  description: structure.description ?? null,

  departements:
    structure.departements?.map((situer) =>
      serializeDepartement(situer.departement!)
    ) ?? [],

  cats:
    structure.cats?.map(serializeCategorie) ?? [],

  personnes: structure.personnes?.map(p => ({ // revoir ....
    id: p.id,
    personneId: p.personneId,
    role: p.roleId,
  })) ?? [],

  realisations: structure.realisations?.map(r => ({ // revoir ....
    id: r.id,
    nom: r.nom,
  })) ?? [],
});
