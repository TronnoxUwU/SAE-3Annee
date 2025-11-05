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
    const tmp = await params;
    const id = Number(tmp.id);

    const structure = await prisma.structure.findUnique({
      where: { id: Number(id) },
      include: {
        departements: { include: { departement: true } },
        tags: { include: { tag: true } },
        realisations: true,
        personnes: true,
      },
    });

    if (!structure) {
      return NextResponse.json(
        { error: "Structure non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json(serializeStructure(structure), { status: 200 });
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
  { params }: { params: { id: string } }
) {
  try {

    const tmp = await params;
    const id = Number(tmp.id);
    const body = await req.json();
    const data = deserializeStructure(body);

    const structure = await prisma.structure.update({
      where: { id: Number(id) },
      data,
      include: {
        departements: { include: { departement: true } },
        tags: { include: { tag: true } },
        realisations: true,
        personnes: true,
      },
    });

    return NextResponse.json(serializeStructure(structure), { status: 200 });
  } catch (error: any) {
    console.error("Erreur PUT /api/structures/[id] :", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/structures/[id]
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await prisma.structure.delete({
      where: { id: Number(params.id) },
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
