import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeCategorie } from "@/lib/serializers";
import { deserializeCategorie } from "@/lib/deserializers";

/**
 * ----- GET /api/categories/[id] -----
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const categorie = await prisma.categorie.findUnique({
      where: { id: Number(id) },
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
    });

    if (!categorie) {
      return NextResponse.json(
        { error: "Categorie introuvable" },
        { status: 404 }
      );
    }

    const serialized = serializeCategorie(categorie);

    return NextResponse.json(serialized, { status: 200 });
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
  __req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log(params);
    const categoryId = Number(id);
    
    // Validation basique
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const existing = await prisma.categorie.findUnique({
      where: { id: categoryId },
      include: {
        children: true,
      },
    });
    console.log(existing);

    if (!existing) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    // Empêcher la suppression si la catégorie a des enfants
    // if (existing.children.length > 0) {
    //   return NextResponse.json(
    //     { 
    //       error: "Impossible de supprimer une catégorie ayant des sous-catégories",
    //       childrenCount: existing.children.length 
    //     },
    //     { status: 400 }
    //   );
    // }


    // delete cat
    console.log(categoryId);
    await prisma.categorie.delete({
      where: { id: categoryId },
    });

    return NextResponse.json(
      { 
        message: "Catégorie supprimée avec succès",
        id: categoryId 
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error("Erreur DELETE /api/categories/[id] :", error);
    
    // error
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
 * ----- PUT /api/categories/[id] -----
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryId = Number(id);
    const body = await req.json();
    
    // Validation basique
    if (isNaN(categoryId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const existing = await prisma.categorie.findUnique({
      where: { id: categoryId },
    });
    if (!existing) {
      return NextResponse.json(
        { error: "Catégorie non trouvée" },
        { status: 404 }
      );
    }

    const newParentId = body.parentId;

    // categorie != enfant
    if (newParentId && newParentId === categoryId) {
      return NextResponse.json(
        { error: "Une catégorie ne peut pas être son propre parent" },
        { status: 400 }
      );
    }

    // parent existe
    if (newParentId) {
      const parentExists = await prisma.categorie.findUnique({
        where: { id: newParentId },
      });
      
      if (!parentExists) {
        return NextResponse.json(
          { error: "Catégorie parent introuvable" },
          { status: 404 }
        );
      }

      // éviter boucle circulaire (enfant = parent)
      const isDescendant = await checkIfDescendant(categoryId, newParentId);
      if (isDescendant) {
        return NextResponse.json(
          { error: "Impossible de créer une relation circulaire" },
          { status: 400 }
        );
      }
    }

    const data = deserializeCategorie(body);

    // update with relation
    const updated = await prisma.categorie.update({
      where: { id: categoryId },
      data: {
        // nom
        nom: data.nom,

        // parent
        parent: newParentId === null 
          ? { disconnect: true }
          : data.parent,

        // tags
        tags: data.tags,
      },
      include: {
        children: true,
        parent: true,
        tags: true,
      },
    });

    const serialized = serializeCategorie(updated);
    return NextResponse.json(serialized, { status: 200 });
    
  } catch (error) {
    console.error("Erreur PUT /api/categories/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour la catégorie" },
      { status: 500 }
    );
  }
}


async function checkIfDescendant(
  ancestorId: number, 
  potentialDescendantId: number
): Promise<boolean> {
  let currentId: number | null = potentialDescendantId;
  
  while (currentId !== null) {
    if (currentId === ancestorId) {
      return true;
    }
    
    const category = await prisma.categorie.findUnique({
      where: { id: currentId },
      select: { parentId: true },
    });
    
    currentId = category?.parentId ?? null;
  }
  
  return false;
}