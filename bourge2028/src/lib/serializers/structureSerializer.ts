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
    cats?: (StructureCat & { categorie: Categorie })[];
    realisations?: Realisation[];
    personnes?: Appartenir[];
  }
) => ({
  id: structure.id,
  nomStructure: structure.nomStructure ?? null,
  adresse: structure.adresse ?? null,
  dateCreation: structure.dateCreation ?? null,
  description: structure.description ?? null,

  departements:
    structure.departements?.map((situer) =>
      serializeDepartement(situer.departement!)
    ) ?? [],

  cats:
    structure.cats?.map(sc => serializeCategorie(sc.categorie)) ?? [],

  latitude: structure.latitude ?? null,
  longitude: structure.longitude ?? null,

  personnes: structure.personnes?.map(p => ({
    id: p.id,
    personneId: p.personneId,
    role: p.roleId,
  })) ?? [],

  realisations: structure.realisations?.map(r => ({
    id: r.id,
    nom: r.nom,
  })) ?? [],
});
