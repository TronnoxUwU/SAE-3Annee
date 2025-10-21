import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { serializeArticle } from "@/lib/serializers/articleSerializer";
import { deserializeArticle } from "@/lib/deserializers/articleDeserializer";

/**
 * ----- GET /api/articles/[id] -----
 * Récupère un article complet par ID
 */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const article = await prisma.article.findUnique({
      where: { id: Number(params.id) },
      include: {
        composants: {
          include: {
            paragraphe: true,
            titre: true,
            image: true,
            caroussels: {
              include: { images: true },
            },
          },
        },
        contenir: {
          include: {
            document: true,
          },
        },
      },
    });

    if (!article) {
      return NextResponse.json({ error: "Article introuvable" }, { status: 404 });
    }

    const serialized = serializeArticle(article);
    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/articles/[id] :", error);
    return NextResponse.json(
      { error: "Erreur interne serveur" },
      { status: 500 }
    );
  }
}

/**
 * ----- DELETE /api/articles/[id] -----
 * Supprime un article et ses composants
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    // Supprimer les composants associés d'abord (clé étrangère)
    await prisma.composant.deleteMany({
      where: { articleId: id },
    });

    // Puis supprimer l'article
    await prisma.article.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Article supprimé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/articles/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer l’article" },
      { status: 500 }
    );
  }
}

/**
 * ----- PUT /api/articles/[id] -----
 * Met à jour un article existant
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    const body = await req.json();

    // Transformation des données JSON en structure Prisma
    const data = deserializeArticle(body);

    // On met à jour l'article et ses composants
    const updated = await prisma.article.update({
      where: { id },
      data: {
        composants: {
          deleteMany: {}, // on supprime les anciens composants
          create: data.composants, // et on recrée les nouveaux
        },
      },
      include: {
        composants: {
          include: {
            paragraphe: true,
            titre: true,
            image: true,
            caroussels: {
              include: { images: true },
            },
          },
        },
        contenir: { include: { document: true } },
      },
    });

    const serialized = serializeArticle(updated);
    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/articles/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour l’article" },
      { status: 500 }
    );
  }
}
