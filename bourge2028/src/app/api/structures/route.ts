import { deserializeStructure } from "@/lib/deserializers";
import prisma from "@/lib/prisma";
import { serializeStructure } from "@/lib/serializers";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

/**
 * POST /api/structures
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = deserializeStructure(body);

    const structure = await prisma.structure.create({
      data: {
        ...data,
        waiting: true, // 🔴 mise en attente
      },
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        personnes: { include: { personne: true } },
        realisations: true,
      },
    });

    return NextResponse.json(serializeStructure(structure), { status: 201 });
  } catch (error: any) {
    console.error("Erreur création structure:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}



/**
 * GET /api/structures
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoriesParam = searchParams.get("cats");
    const departementParam = searchParams.get("deps");
    const waitingParam = searchParams.get("waiting");

    let categoryIds: number[] | undefined;
    let departementIds: number[] | undefined;
    let waiting: boolean | undefined;

    if (categoriesParam) {
      categoryIds = categoriesParam
        .split(",")
        .map(Number)
        .filter(n => !isNaN(n));
    }

    if (departementParam) {
      departementIds = departementParam
        .split(",")
        .map(Number)
        .filter(n => !isNaN(n));
    }

    if (waitingParam !== null) {
      waiting = waitingParam === "true";
    }

    const where: Prisma.StructureWhereInput = {
      ...(waiting !== undefined ? { waiting } : {}),
      ...(departementIds?.length
        ? {
            departements: {
              some: { departementId: { in: departementIds } },
            },
          }
        : {}),
      ...(categoryIds?.length
        ? {
            cats: {
              some: { categorieId: { in: categoryIds } },
            },
          }
        : {}),
    };

    const structures = await prisma.structure.findMany({
      where,
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        realisations: true,
        personnes: {
          include: {
            personne: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      structures.map(serializeStructure),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/structures :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les structures" },
      { status: 500 }
    );
  }
}
