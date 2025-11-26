import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeCarte } from "@/lib/serializers"; // adapte le chemin selon ton projet
import { deserializeCarte } from "@/lib/deserializers"; 
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/cartes
 * Récupère toutes les cartes (avec leurs catégories)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const categoriesParam = searchParams.get("cats");

    let categoryIds: number[] | undefined = undefined;

    if (categoriesParam) {
      categoryIds = categoriesParam
        .split(",")
        .map(id => Number(id))
        .filter(n => !isNaN(n));
    }
    // 🔹 Récupère toutes les cartes
    const cartes = await prisma.carte.findMany({
      where: categoryIds && categoryIds.length > 0
        ? {
          categories: {
            some: {
              id: { in: categoryIds }
            }
          }
        }
        : undefined,
      include: { categories: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(cartes.map(serializeCarte));
  } catch (error) {
    console.error("Erreur GET /cartes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * POST /api/cartes
 * Crée une nouvelle carte
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = deserializeCarte(body) as Prisma.CarteCreateInput;

    const newCarte = await prisma.carte.create({
      data,
      include: { categories: true },
    });

    return NextResponse.json(serializeCarte(newCarte), { status: 201 });
  } catch (error) {
    console.error("Erreur POST /cartes :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
