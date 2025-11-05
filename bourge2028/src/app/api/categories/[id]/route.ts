import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeCategorie } from "@/lib/serializers";

/**
 * ----- GET /api/categories/[id] -----
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Récupération récursive des descendants
    async function getCategoryTree(catId: number) {
      const cat = await prisma.categorie.findUnique({
        where: { id: catId },
        include: {
          tags: true,
          parent: { select: { id: true, nom: true } },
          children: true, // récupère enfants directs
        },
      });

      if (!cat) return null;

      // Appel récursif pour chaque enfant
      const childrenWithDescendants = [];
      for (const child of cat.children) {
        const childWithDescendants = await getCategoryTree(child.id);
        if (childWithDescendants) childrenWithDescendants.push(childWithDescendants);
      }

      return {
        ...serializeCategorie(cat),
        children: childrenWithDescendants,
      };
    }

    const categoryTree = await getCategoryTree(categoryId);

    if (!categoryTree) {
      return NextResponse.json({ error: "Catégorie introuvable" }, { status: 404 });
    }

    return NextResponse.json(categoryTree, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/categories :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les catégories" },
      { status: 500 }
    );
  }
}
