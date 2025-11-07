import prisma from "@/lib/prisma";
import { serializeMateriau } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/materiau/[id] -----
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const materiauId = Number(id);

    if (isNaN(materiauId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const materiau = await prisma.materiau.findUnique({
      where: { id: materiauId },
    });

    if (!materiau) {
      return NextResponse.json({ error: "Matériau introuvable" }, { status: 404 });
    }

    return NextResponse.json(serializeMateriau(materiau), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/materiau :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer le matériau" },
      { status: 500 }
    );
  }
}

/**
 * ---- PUT /api/materiau/[id] -----
 * Met à jour un matériau existant 
 */
export async function PUT(
  req: Request,
    { params }: { params: Promise<{ id: string }> }
    ) {
    try {
        const { id } = await params;
        const materiauId = Number(id);  
        if (isNaN(materiauId)) {
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
        
        const updatedMateriau = await prisma.materiau.update({
            where: { id: materiauId },
            data: { nom, description },
        });
        
        return NextResponse.json(serializeMateriau(updatedMateriau), { status: 200 });
    } catch (error) {
        console.error("Erreur PUT /api/materiau/[id] :", error);
        return NextResponse.json(
            { error: "Impossible de mettre à jour le matériau" },
            { status: 500 }
        );
    }
}

/**
 * ----- DELETE /api/materiau/[id] -----
 * Supprime un matériau existant
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const materiauId = Number(id);

    if (isNaN(materiauId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    await prisma.materiau.delete({
      where: { id: materiauId },
    });

    return NextResponse.json({ message: "Matériau supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/materiau/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le matériau" },
      { status: 500 }
    );
  }
}