import { Article, Categorie, Materiau, Projet, Realisation, RealisationCat, Structure, Technique } from "@prisma/client";
import { serializeStructure } from "./structureSerializer";
import { serializeCategorie } from "./categorieSerializer";
import { serializeMateriau } from "./materiauSerializer";
import { serializeTechnique } from "./techniqueSerializer";
import { serializeProjet } from "./projetSerializer";
import { serializeArticle } from "./articleSerializer";

export const serializeRealisation = (
    realisation: Realisation & {
        structure: Structure[];
        articles?: Article[];
        cats?: (RealisationCat & { categorie: Categorie })[];
        projet?: Projet | null;
        materiaux?: Materiau | null;
        technique?: Technique | null;
    }
) => ({
    id: realisation.id,
    nom: realisation.nom ?? null,
    description: realisation.description ?? null,
    dateCreation: realisation.dateCreation ?? null,
    structure: realisation.structure?.map(serializeStructure) ?? [],
    articles: realisation.articles?.map(serializeArticle) ?? [],
    cats:
        realisation.cats?.map(sc => serializeCategorie(sc.categorie)) ?? [],

    projet: realisation.projet ? serializeProjet(realisation.projet) : null,
    materiaux: realisation.materiaux ? serializeMateriau(realisation.materiaux) : null,
    technique: realisation.technique ? serializeTechnique(realisation.technique) : null,
});
