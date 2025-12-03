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

/**
 * ----- DELETE /api/categories/[id] -----
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);
    
    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const existing = await prisma.categorie.findUnique({
      where: { id: categoryId },
      include: { children: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Catégorie non trouvée" }, { status: 404 });
    }

    if (existing.children.length > 0) {
      return NextResponse.json(
        { error: "Impossible de supprimer une catégorie ayant des sous-catégories" },
        { status: 409 }
      );
    }

    await prisma.categorie.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { message: "Catégorie supprimée avec succès", id: categoryId },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Erreur DELETE /api/categories/[id] :", error);
    
    if (error instanceof Error && error.message.includes("Foreign key constraint")) {
      return NextResponse.json(
        { error: "Impossible de supprimer: la catégorie est référencée par d'autres éléments" },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: "Impossible de supprimer la catégorie" },
      { status: 500 }
    );
  }
}


/**
 * PUT /api/categories/[id]
 * Met à jour le nom d'une catégorie
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await req.json();
    const { nom } = body;

    if (!nom || typeof nom !== "string" || nom.trim() === "") {
      return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
    }

    const updatedCat = await prisma.categorie.update({
      where: { id: categoryId },
      data: { nom },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(serializeCategorie(updatedCat), { status: 200 });
  } catch (error: any) {
    console.error("Erreur PUT /api/categories/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la catégorie" },
      { status: 500 }
    );
  }
}
