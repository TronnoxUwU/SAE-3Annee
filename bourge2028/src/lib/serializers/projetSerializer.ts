// serializeProjet.ts
import { Departement, Projet, Realisation, ProjetDepartement } from "@prisma/client";
import { serializeRealisation } from "./realisationSerializer";

// Typage pour Realisation avec ses relations incluses
type RealisationWithRelations = Realisation & {
  structure: any[];
  cats: any[];
  projet?: any;
  materiaux?: any;
  technique?: any;
};

// Typage pour ProjetDepartement avec le département inclus
type ProjetDepartementWithDep = ProjetDepartement & {
  departement: Departement;
};

export const serializeProjet = (
  projet: Projet & {
    realisation?: RealisationWithRelations | null;
    departements?: ProjetDepartementWithDep[] | null;
  }
) => ({
  id: projet.id,
  nomProjet: projet.nomProjet,
  adresse: projet.adresse || null,
  latitude: projet.latitude || null,
  longitude: projet.longitude || null,
  // Sérialisation sécurisée de la réalisation
  realisation: projet.realisation ? serializeRealisation(projet.realisation) : null,
  // Sérialisation des départements via la table de jointure
  departement: projet.departements?.map(pd => ({
    id: pd.departement.id,
    nomDepartement: pd.departement.nomDep,
  })) || [],
});