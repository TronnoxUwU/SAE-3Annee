import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializeStructure } from "@/lib/serializers";
import { deserializeStructure } from "@/lib/deserializers";

/**
 * GET /api/structures/[id]
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const structureId = Number(id);

    if (isNaN(structureId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }
    console.log("Fetching structure with ID:", structureId);  

    const structure = await prisma.structure.findUnique({
      where: { id: structureId },
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        realisations: true,
        personnes: {
          include: { personne: true },
        },
      },
    });

    if (!structure) {
      return NextResponse.json(
        { error: "Structure non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      serializeStructure(structure),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/structures/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer la structure" },
      { status: 500 }
    );
  }
}



/**
 * PUT /api/structures/[id]
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const structureId = Number(id);

    if (isNaN(structureId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const data = deserializeStructure(body);

    // 🔒 Sécurité : empêcher modification du waiting via cette route
    delete (data as any).waiting;

    const structure = await prisma.structure.update({
      where: { id: structureId },
      data,
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        realisations: true,
        personnes: {
          include: { personne: true },
        },
      },
    });

    return NextResponse.json(
      serializeStructure(structure),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur PUT /api/structures/[id] :", error);

    return NextResponse.json(
      { error: error.message ?? "Erreur lors de la mise à jour" },
      { status: 400 }
    );
  }
}


/**
 * DELETE /api/structures/[id]
 */
export async function DELETE(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
        const tmp = await context.params;

    const deleted = await prisma.structure.delete({
      where: { id: Number(tmp.id) },
    });

    return NextResponse.json(
      { message: "Structure supprimée avec succès", id: deleted.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/structures/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la structure" },
      { status: 500 }
    );
  }
}
