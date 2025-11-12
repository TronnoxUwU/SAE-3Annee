import prisma from "@/lib/prisma";
import { serializeTechnique } from "@/lib/serializers";
import { deserializeTechnique } from "@/lib/deserializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/technique/[id] -----
 */
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const techniqueId = Number(params.id);
    if (isNaN(techniqueId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const technique = await prisma.technique.findUnique({
      where: { id: techniqueId },
      include: { realisation: true },
    });

    if (!technique) return NextResponse.json({ error: "Technique introuvable" }, { status: 404 });

    return NextResponse.json(serializeTechnique(technique), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/technique/[id] :", error);
    return NextResponse.json({ error: "Impossible de récupérer la technique" }, { status: 500 });
  }
}

/**
 * ----- PUT /api/technique/[id] -----
 */
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const techniqueId = Number(params.id);
    if (isNaN(techniqueId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const data = await req.json();
    const techniqueData = deserializeTechnique(data);

    const updated = await prisma.technique.update({
      where: { id: techniqueId },
      data: techniqueData,
      include: { realisation: true },
    });

    return NextResponse.json(serializeTechnique(updated), { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/technique/[id] :", error);
    return NextResponse.json({ error: "Impossible de mettre à jour la technique" }, { status: 500 });
  }
}

/**
 * ----- DELETE /api/technique/[id] -----
 */
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const techniqueId = Number(params.id);
    if (isNaN(techniqueId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    await prisma.technique.delete({ where: { id: techniqueId } });
    return NextResponse.json({ message: "Technique supprimée avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/technique/[id] :", error);
    return NextResponse.json({ error: "Impossible de supprimer la technique" }, { status: 500 });
  }
}
