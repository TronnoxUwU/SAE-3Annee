import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/projet/[id] -----
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projetId = Number(id);

    if (isNaN(projetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
    });

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json(serializeProjet(projet), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/projet :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le projet" },
      { status: 500 }
    );
  }
}

/**
 * ---- PUT /api/projet/[id] -----
 * Met à jour un projet existant 
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projetId = Number(id);
    if (isNaN(projetId)) {
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

    const updatedProjet = await prisma.projet.update({
      where: { id: projetId },
      data: { nom, description },
    });

    return NextResponse.json(serializeProjet(updatedProjet), { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/projet/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le projet" },
      { status: 500 }
    );
  }
}

/** ----- DELETE /api/projet/[id] -----
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projetId = Number(id);

    if (isNaN(projetId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.projet.delete({
      where: { id: projetId },
    });

    return NextResponse.json(
      { message: "Projet supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/projet/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le projet" },
      { status: 500 }
    );
  }
}