import { Materiau, Realisation } from "@prisma/client";
import { serializeRealisation } from "./realisationSerializer";

type RealisationWithRelations = Realisation & {
    structure: any[];
    cats: any[];
    projet?: any;
    materiaux?: any;
    technique?: any;
};

export const serializeMateriau = (dep: Materiau & { realisation?: RealisationWithRelations | null }) => ({
    id: dep.id,
    nomMateriau: dep.nomMateriau,
    realisation: dep.realisation ? serializeRealisation(dep.realisation) : null,
});
