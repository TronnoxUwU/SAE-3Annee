import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeCategorie } from "@/lib/serializers";
import { deserializeCategorie } from "@/lib/deserializers";
import { AuthAdmin } from "@/app/api/api-protection";

/**
 * POST /api/categories
 */
export async function POST(req: Request) {
  try {
    const admin = await AuthAdmin();
    
    if (!admin.access){
      return NextResponse.json(admin)
    }
    const body = await req.json();
    const data = deserializeCategorie(body);

    const categorie = await prisma.categorie.create({
      data,
      include: {
        children: {
          include: {
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
      include: { parent: true, structures: true },
      orderBy: { id: "asc" },
    });

    // Créer un map id => category
    const map = new Map<number, any>();
    allCategories.forEach(cat => {
      map.set(cat.id, { ...serializeCategorie(cat), structures: cat.structures || [], children: [] });
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


    // Fonctions pour enrichir les catégories avec le count des structures liées
    function countStructuresRecursive(cat: any): number {
      let count = cat.structures.length;

      for (const child of cat.children || []) {
        count += countStructuresRecursive(child);
      }

      return count;
    }
    function enrichCategory(cat: any): any {
      return {
        ...cat,
        totalStructures: countStructuresRecursive(cat),
        children: cat.children.map(enrichCategory),
      };
    }



    const enrichedTree = tree.map(enrichCategory);
    return NextResponse.json(enrichedTree, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/categories :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories" },
      { status: 500 }
    );
  }
}




