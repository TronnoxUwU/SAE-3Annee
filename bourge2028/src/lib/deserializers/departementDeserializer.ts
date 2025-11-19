export const deserializeDepartement = (d: any) => {
    return {
        id: d.id,
        nomDep: d.nomDep,
    };
}