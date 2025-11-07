import { deserializeCategorie } from "./categorieDeserializer";
import { deserializeMateriau } from "./materiauDeserializer";
import { deserializeProjet } from "./projetDeserializer";
import { deserializeStructure } from "./structureDeserializer"
import { deserializeTechnique } from "./techniqueDeserializer";

export const deserializeRealisation = (r: any) => {
    return {
        id: r.id,
        nom: r.nom,
        structure: {
            create: r.structure.map(deserializeStructure),
        },
        cats: {
            create: r.categorie.map(deserializeCategorie)
        },
        projet: deserializeProjet(r.projet),
        materiaux: deserializeMateriau(r.materiaux),
        technique: deserializeTechnique(r.technique),
    };
}