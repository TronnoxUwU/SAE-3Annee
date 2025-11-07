import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/projet -----
 */
export async function GET() {
  try {
    const projets = await prisma.projet.findMany({
      include: { realisation: true },
      orderBy: { id: "asc" },
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
    const { nomProjet, realisationId } = await req.json();

    if (!nomProjet || typeof nomProjet !== "string" || nomProjet.trim() === "") {
      return NextResponse.json({ error: "nomProjet invalide" }, { status: 400 });
    }

    if (!realisationId || isNaN(Number(realisationId))) {
      return NextResponse.json({ error: "realisationId invalide" }, { status: 400 });
    }

    const projet = await prisma.projet.create({
      data: {
        nomProjet,
        realisation: { connect: { id: Number(realisationId) } },
      },
      include: { realisation: true },
    });

    return NextResponse.json(serializeProjet(projet), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/projet :", error);
    return NextResponse.json({ error: "Impossible de créer le projet" }, { status: 500 });
  }
}
