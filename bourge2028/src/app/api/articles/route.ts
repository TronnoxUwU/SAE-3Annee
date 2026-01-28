import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { deserializeArticle } from "@/lib/deserializers";
import { serializeArticle } from "@/lib/serializers";
import { AuthAdmin, AuthStructureRole } from "@/app/api/api-protection";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const realisationId = body.realisationId;
    if (!realisationId) {
      return NextResponse.json(
        { error: "realisationId obligatoire" },
        { status: 400 }
      );
    }

    // 🔐 sécurité AVANT création
    const result = await prisma.realisation.findUnique({
      where: { id: Number(realisationId) },
      select: {
        structure: {
          select: { id: true },
          take: 1,
          orderBy: { id: 'asc' },
        },
      },
    });

    const structureId = result?.structure?.[0]?.id ?? null;

    const membre = await AuthStructureRole(structureId, ['Proprietaire']);
    const admin = await AuthAdmin();

    if (!admin.access && !membre.access) {
      if (!membre.access) return NextResponse.json(membre);
      return NextResponse.json(admin);
    }

    // ✅ seulement maintenant
    const data = deserializeArticle(body);

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
    return NextResponse.json(
      { error: "Impossible de créer l’article" },
      { status: 400 }
    );
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
        realisation: true
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