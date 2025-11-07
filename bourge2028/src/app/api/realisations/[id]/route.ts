import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/realisation/[id] -----
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const realisationId = Number(id);

    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const realisation = await prisma.realisation.findUnique({
      where: { id: realisationId },
      include: { techniques: true, materiaux: true, projets: true },
    });

    if (!realisation) {
      return NextResponse.json({ error: "Réalisation introuvable" }, { status: 404 });
    }

    return NextResponse.json(serializeRealisation(realisation), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisation/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la réalisation" },
      { status: 500 }
    );
  }
}

/**
 * ---- PUT /api/realisation/[id] -----
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const realisationId = Number(id);
    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const { nomRealisation } = await req.json();

    if (!nomRealisation || typeof nomRealisation !== "string" || nomRealisation.trim() === "") {
      return NextResponse.json({ error: "nomRealisation invalide" }, { status: 400 });
    }

    const updated = await prisma.realisation.update({
      where: { id: realisationId },
      data: { nomRealisation },
      include: { techniques: true, materiaux: true, projets: true },
    });

    return NextResponse.json(serializeRealisation(updated), { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/realisation/[id] :", error);
    return NextResponse.json({ error: "Impossible de mettre à jour la réalisation" }, { status: 500 });
  }
}

/**
 * ---- DELETE /api/realisation/[id] -----
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const realisationId = Number(id);

    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.realisation.delete({ where: { id: realisationId } });

    return NextResponse.json({ message: "Réalisation supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/realisation/[id] :", error);
    return NextResponse.json({ error: "Impossible de supprimer la réalisation" }, { status: 500 });
  }
}
