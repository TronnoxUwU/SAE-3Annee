import prisma from "@/lib/prisma";
import { serializeMateriau } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/materiau -----
 */
export async function GET() {
  try {
    const materiaux = await prisma.materiau.findMany({
      include: { realisation: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(materiaux.map(serializeMateriau), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/materiau :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les matériaux" },
      { status: 500 }
    );
  }
}

/**
 * ----- POST /api/materiau -----
 */
export async function POST(req: Request) {
  try {
    const { nomMateriau, realisationId } = await req.json();

    if (!nomMateriau || typeof nomMateriau !== "string" || nomMateriau.trim() === "") {
      return NextResponse.json({ error: "nomMateriau invalide" }, { status: 400 });
    }

    if (!realisationId || isNaN(Number(realisationId))) {
      return NextResponse.json({ error: "realisationId invalide" }, { status: 400 });
    }

    const materiau = await prisma.materiau.create({
      data: {
        nomMateriau,
        realisation: { connect: { id: Number(realisationId) } },
      },
      include: { realisation: true },
    });

    return NextResponse.json(serializeMateriau(materiau), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/materiau :", error);
    return NextResponse.json({ error: "Impossible de créer le matériau" }, { status: 500 });
  }
}
