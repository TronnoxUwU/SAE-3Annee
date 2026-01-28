import prisma from "@/lib/prisma";
import { serializeStructure } from "@/lib/serializers";
import { NextResponse } from "next/server";
import { AuthAdmin } from "@/app/api/api-protection";

/**
 * PATCH /api/structures/[id]/validate
 * -> Passe waiting à false
 */
export async function PATCH(
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

    const admin = await AuthAdmin();
    
    if (!admin.access){
      return NextResponse.json(admin)
    }

    const structure = await prisma.structure.update({
      where: { id: structureId },
      data: {
        waiting: false,
      },
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
    console.error("Erreur PATCH /api/structures/[id]/validate :", error);

    return NextResponse.json(
      { error: error.message ?? "Impossible de valider la structure" },
      { status: 400 }
    );
  }
}
