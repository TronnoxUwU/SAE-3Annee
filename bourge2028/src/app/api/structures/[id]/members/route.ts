import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
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

    const { personneId, roleId } = await req.json();

    if (!personneId) {
      return NextResponse.json(
        { error: "personneId est requis" },
        { status: 400 }
      );
    }

    const member = await prisma.appartenir.create({
      data: {
        structureId: structureId,
        personneId: personneId,
        roleId: roleId,
      },
    });

    return NextResponse.json(
      member,
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur POST /api/structures/[id]/members :", error);

    return NextResponse.json(
      { error: error.message ?? "Impossible d'ajouter le membre à la structure" },
      { status: 400 }
    );
  }
}