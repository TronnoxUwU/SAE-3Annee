import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/realisations -----
 * Renvoie toutes les réalisations
 */
export async function GET() {
  try {
    const realisations = await prisma.realisation.findMany({
      include: {
        projets: true,
        documents: true,
      },
      orderBy: { id: "asc" },
    });

    const serializedRealisations = realisations.map(serializeRealisation);

    return NextResponse.json(serializedRealisations, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisations :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les réalisations" },
      { status: 500 }
    );
  }
}

/**
 * ----- POST /api/realisations -----
 * Crée une nouvelle réalisation
 */
export async function POST(req: Request) {
  try {
    const { nom, description } = await req.json();

    if (!nom || !description) {
      return NextResponse.json(
        { error: "Nom et description sont requis" },
        { status: 400 }
      );
    }

    const realisation = await prisma.realisation.create({
      data: { nom, description },
    });

    return NextResponse.json(serializeRealisation(realisation), {
      status: 201,
    });
  } catch (error: any) {
    console.error("Erreur création réalisation:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}