import { Categorie, Materiau, Projet, Realisation, Structure, Technique } from "@prisma/client";
import { serializeStructure } from "./structureSerializer";
import { serializeCategorie } from "./categorieSerializer";
import { serializeMateriau } from "./materiauSerializer";
import { serializeTechnique } from "./techniqueSerializer";
import { serializeProjet } from "./projetSerializer";

export const serializeRealisation = (
    realisation: Realisation & {
        structure: Structure[];
        cats: Categorie[];
        projet?: Projet | null;
        materiaux?: Materiau | null;
        technique?: Technique | null;
    }
) => ({
    id: realisation.id,
    nom: realisation.nom ?? null,
    structure: realisation.structure?.map(serializeStructure) ?? [],
    cats: realisation.cats?.map(serializeCategorie) ?? [],

    projet: realisation.projet ? serializeProjet(realisation.projet) : null,
    materiaux: realisation.materiaux ? serializeMateriau(realisation.materiaux) : null,
    technique: realisation.technique ? serializeTechnique(realisation.technique) : null,
});
