import prisma from "@/lib/prisma";
import { serializeTechnique } from "@/lib/serializers";
import { deserializeTechnique } from "@/lib/deserializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/technique -----
 * Récupère toutes les techniques
 */
export async function GET() {
  try {
    const techniques = await prisma.technique.findMany({
      include: { realisation: true },
    });

    return NextResponse.json(techniques.map(serializeTechnique), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/technique :", error);
    return NextResponse.json({ error: "Impossible de récupérer les techniques" }, { status: 500 });
  }
}

/**
 * ----- POST /api/technique -----
 * Crée une nouvelle technique
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const techniqueData = deserializeTechnique(data);

    const newTechnique = await prisma.technique.create({
      data: techniqueData,
      include: { realisation: true },
    });

    return NextResponse.json(serializeTechnique(newTechnique), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/technique :", error);
    return NextResponse.json({ error: "Impossible de créer la technique" }, { status: 500 });
  }
}
