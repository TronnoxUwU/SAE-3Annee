import prisma from "@/lib/prisma";
import { serializeMateriau } from "@/lib/serializers";
import { deserializeMateriau } from "@/lib/deserializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/materiau -----
 */
export async function GET() {
  try {
    const materiaux = await prisma.materiau.findMany({
      include: { realisation: true },
    });
    return NextResponse.json(materiaux.map(serializeMateriau), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/materiau :", error);
    return NextResponse.json({ error: "Impossible de récupérer les matériaux" }, { status: 500 });
  }
}

/**
 * ----- POST /api/materiau -----
 */
export async function POST(req: Request) {
  try {
    const data = await req.json();
    const materiauData = deserializeMateriau(data);

    const newMateriau = await prisma.materiau.create({
      data: materiauData,
      include: { realisation: true },
    });

    return NextResponse.json(serializeMateriau(newMateriau), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/materiau :", error);
    return NextResponse.json({ error: "Impossible de créer le matériau" }, { status: 500 });
  }
}
