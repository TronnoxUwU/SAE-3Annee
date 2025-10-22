import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeCategorie } from "@/lib/serializers";
import { deserializeCategorie } from "@/lib/deserializers";

/**
 * POST /api/categories
 * Crée une nouvelle catégorie (optionnellement avec parent, children et tags existants)
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = deserializeCategorie(body);

    const categorie = await prisma.categorie.create({
      data,
      include: {
        tags: true,
        children: {
          include: {
            tags: true,
            children: true,
          },
        },
        parent: true,
      },
    });

    return NextResponse.json(serializeCategorie(categorie), { status: 201 });
  } catch (error: any) {
    console.error("Erreur création catégorie:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

/**
 * GET /api/categories
 * Récupère toutes les catégories, avec leurs relations hiérarchiques et tags
 */
export async function GET() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        tags: true,
        parent: {
          select: { id: true, nom: true },
        },
        children: {
          include: {
            tags: true,
            children: true,
          },
        },
      },
      orderBy: {
        id: "asc",
      },
    });

    const serialized = categories.map(serializeCategorie);

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/categories :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories" },
      { status: 500 }
    );
  }
}
