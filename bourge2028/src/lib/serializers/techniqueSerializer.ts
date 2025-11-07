import type { Realisation, Technique } from '@prisma/client';
import { serializeRealisation } from './realisationSerializer';

export const serializeTechnique = (
    tech : Technique & {
        realisation?: Realisation[];
    }
) => ({
    id: tech.id,
    nomTechnique: tech.nomTechnique,
    realisation: tech.realisation?.map(serializeRealisation),
});
