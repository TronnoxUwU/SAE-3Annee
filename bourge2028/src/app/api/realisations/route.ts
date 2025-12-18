import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { deserializeRealisation } from "@/lib/deserializers";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

/**
 * ----- GET /api/realisation -----
 */

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoriesParam = searchParams.get("cats");
    const departementParam = searchParams.get("departement");

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

    const where: Prisma.RealisationWhereInput = {
      ...(departementIds?.length
        ? { departements: { some: { departementId: { in: departementIds } } } }
        : {}),
      ...(categoryIds?.length
        ? { cats: { some: { categorieId: { in: categoryIds } } } }
        : {}),
    };

    const realisations = await prisma.realisation.findMany({
      where,
      include: {
        structure: true,
        cats: { include: { categorie: true } },
        projet: {
          include: {
            departements: true,
          },
        },
        materiaux: true,
        technique: true,
        articles: true,
      },
    });

    return NextResponse.json(
      realisations.map(serializeRealisation),
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur GET /api/realisations :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les réalisations" },
      { status: 500 }
    );
  }
}


/**
 * ----- POST /api/realisation -----
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { type } = data; // type = 'materiau' | 'technique' | 'article' | 'projet'
    const realisationData = deserializeRealisation(data);

    const include: any = {
      structure: true,
      cats: { include: { categorie: true } },

    };

    if (type === "projet") {
      include.projet = { include: { departements: true } };
    }

    if (type === "materiau") {
      include.materiaux =  true ;
    }

    if (type === "technique") {
      include.technique = true ;
    }

    const newRealisation = await prisma.realisation.create({
      data: realisationData,
      include,
    });

    return NextResponse.json(serializeRealisation(newRealisation), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/realisation :", error);
    return NextResponse.json({ error: "Impossible de créer la réalisation" }, { status: 500 });
  }
}

