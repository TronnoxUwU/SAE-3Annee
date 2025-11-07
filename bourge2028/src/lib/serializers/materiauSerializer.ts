import type { Materiau, Realisation } from '@prisma/client';
import { serializeRealisation } from './realisationSerializer';

export const serializeMateriau = (
    dep : Materiau & {
        realisation?: Realisation[];
    }
) => ({
    id: dep.id,
    nomMateriau: dep.nomMateriau,
    realisation: dep.realisation?.map(serializeRealisation),
});