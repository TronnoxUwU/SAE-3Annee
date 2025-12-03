import { deserializeCategorie } from "./categorieDeserializer";
import { deserializeStructure } from "./structureDeserializer";

export const deserializeRealisation = (r: any) => {
  if (!r) return {};

  // Structure : si tableau, créer, sinon connect
  const structureData = r.structure
    ? Array.isArray(r.structure)
      ? { create: r.structure.map(deserializeStructure) }
      : { connect: { id: r.structure.id } }
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

  // Projet
  let projetData;
  if (r.projet) {
    const departementsConnect =
      r.projet.departement?.map((dep: any) => ({ id: dep.id })) ?? [];

    projetData = {
      create: {
        nomProjet: r.projet.nomProjet,
        departement: departementsConnect.length
          ? { connect: departementsConnect }
          : undefined,
      },
    };
  }

  return {
    nom: r.nom,
    description: r.description,
    dateCreation: r.dateCreation,
    structure: structureData,
    cats: catsData,
    projet: projetData,
    articles: articlesData,
    materiaux: r.materiaux
      ? { create: { nomMateriau: r.materiaux.nomMateriau } }
      : undefined,
    technique: r.technique
      ? { create: { nomTechnique: r.technique.nomTechnique } }
      : undefined,
  };
};
