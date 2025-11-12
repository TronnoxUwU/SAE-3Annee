import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeCarte } from "@/lib/serializers"; // adapte le chemin selon ton projet
import { deserializeCarte } from "@/lib/deserializers"; 

const prisma = new PrismaClient();

/**
 * GET /api/cartes/[id]
 * ➜ Récupère une carte spécifique avec ses catégories
 */
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const id = Number(tmp.id);

    const carte = await prisma.carte.findUnique({
      where: { id: id},
      include: { categories: true },
    });

    if (!carte) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    return NextResponse.json(serializeCarte(carte));
  } catch (error) {
    console.error("Erreur GET /cartes/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PUT /api/cartes/[id]
 * ➜ Remplace complètement une carte (toutes les infos)
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await req.json();
    const data = deserializeCarte(body); // on réutilise la version "create" pour tout écraser
    const tmp = await params;
    const id = Number(tmp.id);

    // 🔹 Vérifie si la carte existe
    const existing = await prisma.carte.findUnique({
      where: { id: id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    // 🔹 Supprime toutes les relations catégorie existantes avant de les recréer
    await prisma.carte.update({
      where: { id: id },
      data: { categories: { set: [] } },
    });

    // 🔹 Met à jour la carte complète
    const updatedCarte = await prisma.carte.update({
      where: { id: id },
      data,
      include: { categories: true },
    });

    return NextResponse.json(serializeCarte(updatedCarte));
  } catch (error: any) {
    console.error("Erreur PUT /cartes/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * DELETE /api/cartes/[id]
 * ➜ Supprime une carte
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const id = Number(tmp.id);
    const existing = await prisma.carte.findUnique({
      where: { id: id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Carte non trouvée" }, { status: 404 });
    }

    await prisma.carte.delete({
      where: { id: id },
    });

    return NextResponse.json({ message: "Carte supprimée avec succès" });
  } catch (error) {
    console.error("Erreur DELETE /cartes/[id] :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
