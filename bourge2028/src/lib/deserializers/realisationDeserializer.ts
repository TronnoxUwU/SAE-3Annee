import { deserializeCategorie } from "./categorieDeserializer";
import { deserializeStructure } from "./structureDeserializer";
import { deserializeProjet } from "./projetDeserializer";
import { deserializeTechnique } from "./techniqueDeserializer";
import { deserializeMateriau } from "./materiauDeserializer";

export const deserializeRealisation = (r: any) => {
  if (!r) return {};

  // Structure : toujours connecter des structures existantes
  const structureData = r.structure
    ? Array.isArray(r.structure)
      ? {
          connect: r.structure.map((s: any) => ({
            id: typeof s === 'object' ? s.id : s
          }))
        }
      : { connect: { id: typeof r.structure === 'object' ? r.structure.id : r.structure } }
    : undefined;

  // Categorie
  const catsData = r.categorie?.length
    ? { create: r.categorie.map(deserializeCategorie) }
    : undefined;
  
  const articlesData = r.articles?.length
    ? {
        connect: r.articles
          .filter((a: any) => a?.id)
          .map((a: any) => ({ id: a.id })),
      }
    : undefined;

  // Projet - utilise le deserializer dédié
  const projetData = r.projet 
    ? { create: deserializeProjet(r.projet) }
    : undefined;

  // Matériau - utilise le deserializer dédié
  const materiauxData = r.materiaux
    ? { create: deserializeMateriau(r.materiaux) }
    : undefined;

  // Technique - utilise le deserializer dédié
  const techniqueData = r.technique
    ? { create: deserializeTechnique(r.technique) }
    : undefined;

  return {
    nom: r.nom,
    description: r.description,
    dateCreation: r.dateCreation,
    structure: structureData,
    cats: catsData,
    projet: projetData,
    articles: articlesData,
    materiaux: materiauxData,
    technique: techniqueData,
  };
};