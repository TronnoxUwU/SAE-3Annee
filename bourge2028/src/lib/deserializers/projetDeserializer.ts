import { deserializeDepartement } from "./departementDeserializer";
import { deserializeRealisation } from "./realisationDeserializer";

export const deserializeProjet = (p: any) => {
    return {
        id: p.id,
        nomProjet: p.nomProjet,
        realisation: p.realisation.map(deserializeRealisation),

        departement: {
            create: p.departement.map(deserializeDepartement)
        },

    };
}