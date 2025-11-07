import {Departement, Projet, Realisation} from '@prisma/client';
import { serializeDepartement } from './departementSerializer';
import { serializeRealisation } from './realisationSerializer';

export const serializeProjet = (
    projet: Projet & {
        realisation?: Realisation[];
        departement?: Departement[];
    }

) => ({
    id: projet.id,
    nomProjet: projet.nomProjet,
    realisation: projet.realisation.map(serializeRealisation),

    departement: projet.departement.map(serializeDepartement),

});