import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { serializeCarte } from "@/lib/serializers"; // adapte le chemin selon ton projet
import { deserializeCarte } from "@/lib/deserializers"; 
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET /api/cartes
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoriesParam = searchParams.get("cats");
    const waitingParam = searchParams.get("waiting");

    let categoryIds: number[] | undefined;
    let waiting: boolean | undefined;

    if (categoriesParam) {
      categoryIds = categoriesParam
        .split(",")
        .map(Number)
        .filter(n => !isNaN(n));
    }

    if (waitingParam !== null) {
      waiting = waitingParam === "true";
    }

    const where: Prisma.CarteWhereInput = {
      ...(waiting !== undefined ? { waiting } : {}),
      ...(categoryIds?.length
        ? {
            categories: {
              some: {
                id: { in: categoryIds },
              },
            },
          }
        : {}),
    };

    const cartes = await prisma.carte.findMany({
      where,
      include: { categories: true },
      orderBy: { id: "desc" },
    });

    return NextResponse.json(cartes.map(serializeCarte), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/cartes :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}


/**
 * POST /api/cartes
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = deserializeCarte(body) as Prisma.CarteCreateInput;

    const newCarte = await prisma.carte.create({
      data: {
        ...data,
        waiting: true, // 🔴 forçage métier
      },
      include: { categories: true },
    });

    return NextResponse.json(
      serializeCarte(newCarte),
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST /api/cartes :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
