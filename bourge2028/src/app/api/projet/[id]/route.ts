import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/projet/[id] -----
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projetId = Number(id);

    if (isNaN(projetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
      include: { realisation: true },
    });

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json(serializeProjet(projet), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/projet/[id] :", error);
    return NextResponse.json({ error: "Impossible de récupérer le projet" }, { status: 500 });
  }
}

/**
 * ---- PUT /api/projet/[id] -----
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projetId = Number(id);
    if (isNaN(projetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const { nomProjet, realisationId } = await req.json();

    if (!nomProjet || typeof nomProjet !== "string" || nomProjet.trim() === "") {
      return NextResponse.json({ error: "nomProjet invalide" }, { status: 400 });
    }

    const data: any = { nomProjet };
    if (realisationId) data.realisation = { connect: { id: Number(realisationId) } };

    const updated = await prisma.projet.update({
      where: { id: projetId },
      data,
      include: { realisation: true },
    });

    return NextResponse.json(serializeProjet(updated), { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/projet/[id] :", error);
    return NextResponse.json({ error: "Impossible de mettre à jour le projet" }, { status: 500 });
  }
}

/**
 * ---- DELETE /api/projet/[id] -----
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const projetId = Number(id);

    if (isNaN(projetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.projet.delete({ where: { id: projetId } });

    return NextResponse.json({ message: "Projet supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/projet/[id] :", error);
    return NextResponse.json({ error: "Impossible de supprimer le projet" }, { status: 500 });
  }
}
