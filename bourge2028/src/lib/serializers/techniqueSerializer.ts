import { Technique, Realisation } from "@prisma/client";
import { serializeRealisation } from "./realisationSerializer";

// Typage des relations pour Realisation
type RealisationWithRelations = Realisation & {
  structure: any[];
  cats: any[];
  projet?: any;
  materiaux?: any;
  technique?: any;
};

export const serializeTechnique = (
  tech: Technique & { realisation?: RealisationWithRelations | null }
) => ({
  id: tech.id,
  nomTechnique: tech.nomTechnique,
  realisation: tech.realisation ? serializeRealisation(tech.realisation) : null,
});
