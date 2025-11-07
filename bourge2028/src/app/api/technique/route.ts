import prisma from "@/lib/prisma";
import { serializeTechnique } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/technique -----
 */
export async function GET() {
  try {
    const techniques = await prisma.technique.findMany({
      include: { realisation: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(techniques.map(serializeTechnique), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/technique :", error);
    return NextResponse.json({ error: "Impossible de récupérer les techniques" }, { status: 500 });
  }
}

/**
 * ----- POST /api/technique -----
 */
export async function POST(req: Request) {
  try {
    const { nomTechnique, realisationId } = await req.json();

    if (!nomTechnique || typeof nomTechnique !== "string" || nomTechnique.trim() === "") {
      return NextResponse.json({ error: "nomTechnique invalide" }, { status: 400 });
    }

    if (!realisationId || isNaN(Number(realisationId))) {
      return NextResponse.json({ error: "realisationId invalide" }, { status: 400 });
    }

    const technique = await prisma.technique.create({
      data: {
        nomTechnique,
        realisation: { connect: { id: Number(realisationId) } },
      },
      include: { realisation: true },
    });

    return NextResponse.json(serializeTechnique(technique), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/technique :", error);
    return NextResponse.json({ error: "Impossible de créer la technique" }, { status: 500 });
  }
}
