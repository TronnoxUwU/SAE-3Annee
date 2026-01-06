import type { Personne } from "@prisma/client";


export function serializePersonne(personne) {
  if (!personne) return null;

  return {
    id: personne.id,
    identifiant: personne.identifiant,
    nom: personne.nom,
    prenom: personne.prenom,
    email: personne.email,
    description: personne.description,
    role: personne.role,
    dateCreation: personne.dateCreation?.toISOString() ?? null,

    // departement: personne.departement
    //   ? {
    //       id: personne.departement.id,
    //       nom: personne.departement.nom,
    //     }
    //   : null,

    // Liste des structures auxquelles la personne appartient
    structures:
      personne.structures?.map((app) => ({
        id: app.id,
        role: app.roleId ?? null,
        structure: app.structure
          ? {
              id: app.structure.id,
              nomStructure: app.structure.nomStructure,
              description: app.structure.description,
              dateCreation: app.structure.dateCreation?.toISOString() ?? null,
            }
          : null,
      })) ?? [],

    // Liste des rédactions faites par la personne
    redactions:
      personne.redactions?.map((red) => ({
        id: red.id,
        dateRedaction: red.dateRedaction?.toISOString() ?? null,
        dateModif: red.dateModif?.toISOString() ?? null,
        article: red.article
          ? {
              id: red.article.id,
              titre: red.article.titre,
            }
          : null,
        realisation: red.realisation
          ? {
              id: red.realisation.id,
              nom: red.realisation.nom,
            }
          : null,
      })) ?? [],
  };
}