import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeCategorie } from "@/lib/serializers";
import { deserializeCategorie } from "@/lib/deserializers";

/**
 * POST /api/categories
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(body)
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
 * Renvoie l'arbre complet multi-niveaux
 */
export async function GET() {
  try {
    const allCategories = await prisma.categorie.findMany({
      include: { tags: true, parent: true },
      orderBy: { id: "asc" },
    });

    // Créer un map id => category
    const map = new Map<number, any>();
    allCategories.forEach(cat => {
      map.set(cat.id, { ...serializeCategorie(cat), children: [] });
    });

    const tree: any[] = [];

    // Construire l'arbre
    map.forEach(cat => {
      if (cat.parentId === null) {
        tree.push(cat);
      } else {
        const parent = map.get(cat.parentId);
        if (parent) {
          parent.children.push(cat);
        }
      }
    });

    return NextResponse.json(tree, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/categories :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories" },
      { status: 500 }
    );
  }
}