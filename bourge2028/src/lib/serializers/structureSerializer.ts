import {
  Structure,
  Departement,
  Situer,
  StructureCat,
  Categorie,
  Realisation,
  Appartenir,
  Role,
  Personne,
} from "@prisma/client";
import { serializeDepartement } from "./departementSerializer";
import { serializeCategorie } from "./categorieSerializer";

export const serializeStructure = (
  structure: Structure & {
    departements?: (Situer & { departement?: Departement | null })[];
    cats?: (StructureCat & { categorie: Categorie })[];
    realisations?: Realisation[];
    personnes?: (Appartenir & {
      role?: Role | null;
      personne?: Personne | null;
    })[];
  }
) => ({
  id: structure.id,
  nomStructure: structure.nomStructure ?? null,
  adresse: structure.adresse ?? null,
  dateCreation: structure.dateCreation ?? null,
  description: structure.description ?? null,
  waiting: structure.waiting ?? true,

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
    nomRole: p.role?.nom ?? null,
    nom: p.personne?.nom ?? null,
    prenom: p.personne?.prenom ?? null,
  })) ?? [],

  realisations: structure.realisations?.map(r => ({
    id: r.id,
    nom: r.nom,
  })) ?? [],
});
