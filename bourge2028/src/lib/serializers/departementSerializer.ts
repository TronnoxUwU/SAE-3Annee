import type { Departement } from '@prisma/client';

export const serializeDepartement = (dep : Departement) => ({
    id: dep.id,
    nomDep: dep.nomDep,
});