import { deserializeDepartement } from "./departementDeserializer";

export const deserializeProjet = (p: any) => {
    if (!p) return undefined;

    let departementData;
    if (p.departement?.length) {
        // On transforme chaque département via ton deserializer
        const deps = p.departement.map((d: any) => deserializeDepartement(d));

        // On sépare ceux qui ont un id (existant) et ceux qui n'ont pas d'id (nouveaux)
        const connectDeps = deps.filter(d => d.id).map(d => ({ id: d.id }));
        const createDeps = deps.filter(d => !d.id).map(d => ({ nomDep: d.nomDep }));

        departementData = {};
        if (connectDeps.length) departementData.connect = connectDeps;
        if (createDeps.length) departementData.create = createDeps;
    }

    return {
        nomProjet: p.nomProjet,
        realisation: p.realisation?.id ? { connect: { id: p.realisation.id } } : undefined,
        departement: departementData,
    };
};