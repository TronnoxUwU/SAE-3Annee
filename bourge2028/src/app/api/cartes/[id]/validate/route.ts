import prisma from "@/lib/prisma";
import { serializeCarte } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * PATCH /api/cartes/[id]/validate
 * -> Passe waiting à false
 */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const carteId = Number(id);

    if (isNaN(carteId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const carte = await prisma.carte.update({
      where: { id: carteId },
      data: { waiting: false },
      include: { categories: true },
    });

    return NextResponse.json(
      serializeCarte(carte),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur PATCH /api/cartes/[id]/validate :", error);

    return NextResponse.json(
      { error: error.message ?? "Impossible de valider la carte" },
      { status: 400 }
    );
  }
}
