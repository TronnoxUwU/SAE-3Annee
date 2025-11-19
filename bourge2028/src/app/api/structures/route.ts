import { deserializeStructure } from "@/lib/deserializers";
import prisma from "@/lib/prisma";
import { serializeStructure } from "@/lib/serializers";
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
        departements: { include: { departement: false } },
        tags: { include: { tag: true } },
        realisations: true,
        personnes: true,
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
export async function GET() {
  try {
    const structures = await prisma.structure.findMany({
      include: {
        departements: { include: { departement: false } },
        tags: { include: { tag: true } },
        realisations: true,
        personnes: true,
      },
      orderBy: {
        id: "asc",
      },
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
