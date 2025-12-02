import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // Récupération des paramètres query si besoin
    const { searchParams } = new URL(req.url);
    
    const realisations = await prisma.realisation.findMany({
      where: {
        projetId: { not: null }, // 🔹 récupère uniquement les réalisations avec projet non nul
      },
      include: {
        structure: true,
        cats: { include: { Cat: true } },
        projet: {
          include: { departement: true },
        },
        materiaux: true,
        technique: true,
      },
    });

    return NextResponse.json(
      realisations.map(serializeRealisation),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/realisations :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les réalisations" },
      { status: 500 }
    );
  }
}
