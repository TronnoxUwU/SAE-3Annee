import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/realisations/[id] -----
 * Renvoie une réalisation par son ID
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const realisationId = Number(id);

    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const realisation = await prisma.realisation.findUnique({
      where: { id: realisationId },
      include: {
        projets: true,
        documents: true,
      },
    });

    if (!realisation) {
      return NextResponse.json({ error: "Réalisation non trouvée" }, { status: 404 });
    }

    return NextResponse.json(serializeRealisation(realisation), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisations/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la réalisation" },
      { status: 500 }
    );
  }
}

/**
 * ---- PUT /api/realisations/[id] -----
 * Met à jour une réalisation existante 
 */

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const realisationId = Number(id);

    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { nom, description } = body;

    if (!nom || typeof nom !== "string" || nom.trim() === "") {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    if (!description || typeof description !== "string" || description.trim() === "") {
      return NextResponse.json({ error: "Description invalide" }, { status: 400 });
    }

    const updatedRealisation = await prisma.realisation.update({
      where: { id: realisationId },
      data: { nom, description },
      include: {
        projets: true,
        documents: true,
      },
    });
    
    return NextResponse.json(serializeRealisation(updatedRealisation), { status: 200 });
  } catch (error: any) {
    console.error("Erreur PUT /api/realisations/[id] :", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * ----- DELETE /api/realisations/[id] -----
 * Supprime une réalisation existante
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const realisationId = Number(id);

    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.realisation.delete({
      where: { id: realisationId },
    });

    return NextResponse.json({ message: "Réalisation supprimée avec succès" }, { status: 200 });
  } catch (error: any) {
    console.error("Erreur DELETE /api/realisations/[id] :", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}