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

    const where: Prisma.ProjetWhereInput = {
      ...(departementIds?.length
        ? { departementId: { in: departementIds } }
        : {}),

      ...(categoryIds?.length
        ? {
          realisation: {
            cats: {
              some: {
                categorieId: { in: categoryIds }
              }
            }
          }
        }
        : {}),
    };


    const projets = await prisma.projet.findMany({
      where,
      include: {
        realisation: {
          include: {
            cats: { include: { categorie: true } },
            structure: true,
          },
        },
        departement: true,
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
      include: { realisation: true, departement: true },
    });

    return NextResponse.json(serializeProjet(newProjet), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/projet :", error);
    return NextResponse.json({ error: "Impossible de créer le projet" }, { status: 500 });
  }
}
