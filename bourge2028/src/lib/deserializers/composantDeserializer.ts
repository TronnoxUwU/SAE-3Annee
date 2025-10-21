export const deserializeComposant = (c: any) => {
  const base = {
    positionComposant: c.positionComposant,
    type: c.type,
  };
  switch (c.type) {
    case "titre":
      return {
        ...base,
        titre: {
          create: {
            niveauTitre: c.titre?.niveauTitre ?? 1,
            texteTitre: c.titre?.texteTitre ?? "",
          },
        },
      };

    case "paragraphe":
      return {
        ...base,
        paragraphe: {
          create: {
            texteParagraphe: c.paragraphe?.texteParagraphe ?? "",
          },
        },
      };

    case "image":
      return {
        ...base,
        image: {
          create: {
            lienImage: c.image?.lienImage ?? "",
            titreImage: c.image?.titreImage ?? "",
            copyright: c.image?.copyright ?? "",
          },
        },
      };

    case "caroussel":
      return {
        ...base,
        caroussels: {
          create: c.caroussels?.map((car, ci) => ({
            titreCaroussel: car.titreCaroussel ?? "",
            images: {
              create: car.images?.map((img: any, i: number) => ({
                composant: {
                  create: {
                    positionComposant: i + 1,
                    type: "image",
                  },
                },
                lienImage: img.lienImage ?? "",
                titreImage: img.titreImage ?? "",
                copyright: img.copyright ?? "",
              })) ?? [],
            },
          })) ?? [],
        },
      };

    default:
      throw new Error(`Type de composant inconnu: ${c.type}`);
  }
};
