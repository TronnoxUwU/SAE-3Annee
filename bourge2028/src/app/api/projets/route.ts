import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { deserializeProjet } from "@/lib/deserializers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * ----- GET /api/projet -----
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoriesParam = searchParams.get("cats");
    const departementParam = searchParams.get("deps");
    const searchParam = searchParams.get("search")?.toLowerCase();
    let categoryIds: number[] | undefined = undefined;
    let departementIds: number[] | undefined = undefined;

    if (categoriesParam) {
      categoryIds = categoriesParam
        .split(",")
        .map(id => Number(id))
        .filter(n => !isNaN(n));
    }
    if (departementParam) {
      departementIds = departementParam
        .split(",")
        .map(id => Number(id))
        .filter(n => !isNaN(n));
    }

    const realisationWhere: Prisma.RealisationWhereInput = {};

    if (categoryIds?.length) {
      realisationWhere.cats = {
        some: {
          categorieId: { in: categoryIds }
        }
      };
    }

    if (searchParam) {
      realisationWhere.structure = {
        some:{
          nomStructSearch: {
            contains: searchParam
          }
        }
      };
    }

    const where: Prisma.ProjetWhereInput = {};

    if (departementIds?.length) {
      where.departements = {
        some: {
          departementId: { in: departementIds }
        }
      };
    }

    if (Object.keys(realisationWhere).length) {
      where.realisation = realisationWhere;
    }


    const projets = await prisma.projet.findMany({
      where,
      include: {
        realisation: {
          include: {
            cats: { include: { categorie: true } },
            structure: true,
          },
        },
        departements: {
          include: { departement: true }
        },
      },
    });

    return NextResponse.json(projets.map(serializeProjet), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/projet :", error);
    return NextResponse.json({ error: "Impossible de récupérer les projets" }, { status: 500 });
  }
}

/**
 * ----- POST /api/projet -----
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const projetData = deserializeProjet(data);

    const newProjet = await prisma.projet.create({
      data: projetData,
      include: {
        realisation: {
          include: {
            cats: { include: { categorie: true } },
            structure: true,
          },
        },
        departements: {
          include: { departement: true }
        }
      },
    });

    return NextResponse.json(serializeProjet(newProjet), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/projet :", error);
    return NextResponse.json({ error: "Impossible de créer le projet" }, { status: 500 });
  }
}