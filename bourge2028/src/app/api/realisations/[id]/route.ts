import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { deserializeRealisation } from "@/lib/deserializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/realisation/[id] -----
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const realisation = await prisma.realisation.findUnique({
      where: { id: realisationId },
      include: {
        structure: true,
        cats: true,
        projet: {
          include: {
            departement: true,
          },
        },
        materiaux: true,
        technique: true,
        articles: true,
      },
    });


    if (!realisation) return NextResponse.json({ error: "Réalisation introuvable" }, { status: 404 });

    return NextResponse.json(serializeRealisation(realisation), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisation/[id] :", error);
    return NextResponse.json({ error: "Impossible de récupérer la réalisation" }, { status: 500 });
  }
}

/**
 * ----- PUT /api/realisation/[id] -----
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await req.json();
    const realisationData = deserializeRealisation(body);

    const updated = await prisma.realisation.update({
      where: { id: realisationId },
      data: realisationData,
      include: {
        structure: true,
        cats: true,
        projet: {
          include: {
            departement: true,
          },
        },
        materiaux: true,
        technique: true,
        articles: true,
      },
    });


    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Erreur PUT /api/realisations/[id] :", error);
    return NextResponse.json({ error: error.message || "Impossible de mettre à jour la réalisation" }, { status: 500 });
  }
}


/**
 * ----- DELETE /api/realisation/[id] -----
 */
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    // Supprimer les enfants liés si existent
    await prisma.$transaction([
      prisma.materiau.deleteMany({ where: { realisationId } }),
      prisma.technique.deleteMany({ where: { realisationId } }),
      prisma.projet.deleteMany({ where: { realisationId } }),
      prisma.realisation.delete({ where: { id: realisationId } }),
      prisma.articles.deleteMany({ where: { realisationId } })
    ]);


    return NextResponse.json({ message: "Réalisation et ses relations supprimées avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/realisations/[id] :", error);
    return NextResponse.json({ error: "Impossible de supprimer la réalisation" }, { status: 500 });
  }
}
