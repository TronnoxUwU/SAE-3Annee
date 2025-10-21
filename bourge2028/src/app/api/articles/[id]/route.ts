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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const article = await prisma.article.findUnique({
      where: { id: Number(id) },
      include: {
        composants: {
          include: {
            paragraphe: true,
            titre: true,
            image: true,
            caroussels: {
              include: {
                images: true,
              },
            },
          },
        },
        documents: true, // ✅ relation directe maintenant
      },
    });

    if (!article) {
      return NextResponse.json(
        { error: "Article introuvable" },
        { status: 404 }
      );
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const id = Number(tmp.id);

    // 1️⃣ Récupérer les composants de l'article
    const composants = await prisma.composant.findMany({
      where: { articleId: id },
      select: { id: true },
    });
    const composantIds = composants.map(c => c.id);

    // 2️⃣ Supprimer les images liées aux caroussels
    await prisma.image.deleteMany({
      where: { composantId: { in: composantIds } },
    });

    // 3️⃣ Supprimer les caroussels
    await prisma.caroussel.deleteMany({
      where: { composantId: { in: composantIds } },
    });

    // 4️⃣ Supprimer les composants
    await prisma.composant.deleteMany({
      where: { id: { in: composantIds } },
    });

    // 5️⃣ Supprimer l'article
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Transformer le corps de la requête en structure Prisma
    const data = deserializeArticle(body);

    // Met à jour l'article : supprime les anciens composants et documents, puis recrée
    const updated = await prisma.article.update({
      where: { id: Number(id) },
      data: {
        composants: {
          deleteMany: {}, // 🔥 supprime tous les anciens composants
          create: data.composants?.create ?? [], // recrée les nouveaux
        },
        documents: {
          deleteMany: {}, // 🔥 supprime les anciens documents liés à l'article
          create: data.documents?.create ?? [], // recrée les nouveaux
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
        documents: true, // ✅ plus de "contenir"
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

