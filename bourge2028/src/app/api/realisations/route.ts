import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/realisation -----
 */
export async function GET() {
  try {
    const realisations = await prisma.realisation.findMany({
      include: { techniques: true, materiaux: true, projets: true },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(realisations.map(serializeRealisation), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisation :", error);
    return NextResponse.json({ error: "Impossible de récupérer les réalisations" }, { status: 500 });
  }
}

/**
 * ----- POST /api/realisation -----
 */
export async function POST(req: Request) {
  try {
    const { nomRealisation } = await req.json();

    if (!nomRealisation || typeof nomRealisation !== "string" || nomRealisation.trim() === "") {
      return NextResponse.json({ error: "nomRealisation invalide" }, { status: 400 });
    }

    const realisation = await prisma.realisation.create({
      data: { nomRealisation },
    });

    return NextResponse.json(serializeRealisation(realisation), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/realisation :", error);
    return NextResponse.json({ error: "Impossible de créer la réalisation" }, { status: 500 });
  }
}
