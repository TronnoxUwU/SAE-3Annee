import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roleId = Number(id);

    const role = await prisma.role.findUnique({
      where: { id: roleId }
    });

    if (!role) {
      return NextResponse.json(
        { error: "Rôle non trouvée" },
        { status: 404 }
      );
    }
    console.log(role);

    return NextResponse.json(
      role,
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/role/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le role sur la structure" },
      { status: 500 }
    );
  }
}