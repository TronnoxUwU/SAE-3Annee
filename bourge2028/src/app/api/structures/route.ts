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
      data,
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

    const where: Prisma.StructureWhereInput = {
      ...(departementIds?.length
        ? { departements: { some: { departementId: { in: departementIds } } } }
        : {}),
      ...(categoryIds?.length
        ? { cats: { some: { categorieId: { in: categoryIds } } } }
        : {}),
    };

    const structures = await prisma.structure.findMany({
      where,
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        realisations: true,
        personnes: true,
      },
      orderBy: { id: "asc" },
    });

    const serialized = structures.map(serializeStructure);

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/structures :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les structures" },
      { status: 500 }
    );
  }
}
