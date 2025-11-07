import prisma from "@/lib/prisma";
import { serializeMateriau } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/materiau -----
 */
export async function GET() {
  try {
    const materiaux = await prisma.materiau.findMany({
      orderBy: { id: "asc" },
    });

    const serializedMateriaux = materiaux.map(serializeMateriau);

    return NextResponse.json(serializedMateriaux, { status: 200 });
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
 * Crée un nouveau matériau
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

    const materiau = await prisma.materiau.create({
      data: { nom, description },
    });

    return NextResponse.json(serializeMateriau(materiau), {
      status: 201,
    });
  } catch (error: any) {
    console.error("Erreur création matériau:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}