import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { deserializeProjet } from "@/lib/deserializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/projet -----
 */
export async function GET() {
  try {
    const projets = await prisma.projet.findMany({
      include: { realisation: true, departement: true },
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
    const data = await req.json();
    const projetData = deserializeProjet(data);

    const newProjet = await prisma.projet.create({
      data: projetData,
      include: { realisation: true, departement: true },
    });

    return NextResponse.json(serializeProjet(newProjet), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /api/projet :", error);
    return NextResponse.json({ error: "Impossible de créer le projet" }, { status: 500 });
  }
}
