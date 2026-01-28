import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    const { id, mid } = await params;
    const structureId = Number(id);
    const memberId = Number(mid);

    if (isNaN(structureId) || isNaN(memberId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const { roleId } = await req.json();

    if (!roleId) {
      return NextResponse.json(
        { error: "roleId est requis" },
        { status: 400 }
      );
    }

    const updatedMember = await prisma.structurePersonne.updateMany({
      where: {
        structureId: structureId,
        personneId: memberId,
      },
      data: {
        roleId: roleId,
      },
    });

    if (updatedMember.count === 0) {
      return NextResponse.json(
        { error: "Membre non trouvé dans cette structure" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Rôle du membre mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur PUT /api/structures/[id]/members/[mid] :", error);

    return NextResponse.json(
      { error: error.message ?? "Impossible de mettre à jour le rôle du membre" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    const { id, mid } = await params;
    const structureId = Number(id);
    const memberId = Number(mid);

    if (isNaN(structureId) || isNaN(memberId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const deletedMember = await prisma.structurePersonne.deleteMany({
      where: {
        structureId: structureId,
        personneId: memberId,
      },
    });

    if (deletedMember.count === 0) {
      return NextResponse.json(
        { error: "Membre non trouvé dans cette structure" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Membre supprimé avec succès de la structure" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur DELETE /api/structures/[id]/members/[mid] :", error);

    return NextResponse.json(
      { error: error.message ?? "Impossible de supprimer le membre de la structure" },
      { status: 400 }
    );
  }
}