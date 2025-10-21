import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deserializeArticle } from "@/lib/deserializers";
import { serializeArticle } from "@/lib/serializers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data = deserializeArticle(body);

    console.log(data)

    const article = await prisma.article.create({
      data,
      include: {
        composants: {
          include: {
            titre: true,
            paragraphe: true,
            image: true,
            caroussels: { include: { images: true } },
          },
        },
      },
    });

    return NextResponse.json(serializeArticle(article), { status: 201 });
  } catch (error: any) {
    console.error("Erreur création article:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET() {
  try {
    // Récupérer tous les articles avec leurs composants et documents liés
    const articles = await prisma.article.findMany({
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
        documents: true, // ✅ relation directe, plus de "contenir"
      },
      orderBy: {
        id: "asc",
      },
    });

    // Sérialisation propre pour l'API
    const serialized = articles.map(serializeArticle);

    return NextResponse.json(serialized, { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/articles :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les articles" },
      { status: 500 }
    );
  }
}