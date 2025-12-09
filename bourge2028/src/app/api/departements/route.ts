import { deserializeDepartement } from "@/lib/deserializers";
import prisma from "@/lib/prisma";
import { serializeDepartement } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * POST /api/departement
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = deserializeDepartement(body);

    const departement = await prisma.departement.create({
      data,
    });

    return NextResponse.json(serializeDepartement(departement), { status: 201 });
  } catch (error: any) {
    console.error("Erreur création département:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * GET /api/departement
 */
export async function GET() {
  try {
    const departements = await prisma.departement.findMany({
      orderBy: {
        id: "asc",
      },
    });

    const serialized = departements.map(serializeDepartement);

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/departement :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les départements" },
      { status: 500 }
    );
  }
}