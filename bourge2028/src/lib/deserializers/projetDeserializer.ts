// deserializeProjet.ts
import { deserializeDepartement } from "./departementDeserializer";

export const deserializeProjet = (p: any) => {
    if (!p) return undefined;

    let departementsData;
    if (p.departement?.length) {
        // On transforme chaque département via ton deserializer
        const deps = p.departement.map((d: any) => deserializeDepartement(d));

        // On sépare ceux qui ont un id (existant) et ceux qui n'ont pas d'id (nouveaux)
        const connectDeps = deps.filter(d => d.id).map(d => ({ 
            departement: { connect: { id: d.id } }
        }));
        const createDeps = deps.filter(d => !d.id).map(d => ({ 
            departement: { create: { nomDep: d.nomDep } }
        }));

        departementsData = {};
        if (connectDeps.length) departementsData.create = connectDeps;
        if (createDeps.length) departementsData.create = [...(departementsData.create || []), ...createDeps];
    }

    return {
        nomProjet: p.nomProjet,
        realisation: p.realisation?.id ? { connect: { id: p.realisation.id } } : undefined,
        adresse: p.adresse,
        latitude: p.latitude,
        longitude: p.longitude,
        departements: departementsData,
    };
};