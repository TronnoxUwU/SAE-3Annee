import { Departement, Projet, Realisation } from "@prisma/client";
import { serializeDepartement } from "./departementSerializer";
import { serializeRealisation } from "./realisationSerializer";

// Typage pour Realisation avec ses relations incluses
type RealisationWithRelations = Realisation & {
  structure: any[];
  cats: any[];
  projet?: any;
  materiaux?: any;
  technique?: any;
};

export const serializeProjet = (
  projet: Projet & {
    realisation?: RealisationWithRelations | null;
    departement?: Departement[] | null;
  }
) => ({
  id: projet.id,
  nomProjet: projet.nomProjet,
  adresse: projet.adresse || null,
  latitude: projet.latitude || null,
  longitude: projet.longitude || null,
  // Sérialisation sécurisée de la réalisation
  realisation: projet.realisation ? serializeRealisation(projet.realisation) : null,
  // Sérialisation des départements ou tableau vide si aucun
  departement: projet.departement?.map(dep => ({
    id: dep.id,
    nomDepartement: dep.nomDep,
  })) || [],
});
