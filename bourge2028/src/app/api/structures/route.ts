import { deserializeStructure } from "@/lib/deserializers";
import prisma from "@/lib/prisma";
import { serializeStructure } from "@/lib/serializers";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
/**
 * POST /api/structures
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      nomStructure,
      description,
      adresse,
      longitude,
      latitude,
      lienPhoto,
      departements = [],
      cats = [],
      personnes = [] // Contient session.user.id
    } = body;

    if (!nomStructure) {
      return NextResponse.json({ error: "Le nom de la structure est requis." }, { status: 400 });
    }

    // Récupérer le rôle "Proprietaire" dans la table Role
    const proprietaireRole = await prisma.role.findUnique({
      where: { nom: "Proprietaire" },
    });
    if (!proprietaireRole) {
      return NextResponse.json({ error: "Le rôle 'Proprietaire' n'existe pas." }, { status: 500 });
    }

    // Création de la structure avec relations
    const structure = await prisma.structure.create({
      data: {
        nomStructure,
        nomStructSearch: nomStructure.toLowerCase(),
        description: description || null,
        adresse: adresse || null,
        lienPhoto: lienPhoto || null,
        latitude: latitude ?? null,
        longitude: longitude ?? null,
        dateCreation: new Date(),
        waiting: true,

        // Relations Situer
        departements: {
          create: departements.map((d: any) => ({
            departement: { connect: { id: d.id } },
          })),
        },

        // Relations StructureCat
        cats: {
          create: cats.map((c: any) => ({
            categorie: { connect: { id: c.id } },
          })),
        },

        // Relation Appartenir : ajouter la personne créant la structure avec le rôle "Proprietaire"
        personnes: {
          create: personnes.map((p: any) => ({
            personne: { connect: { id: p.personneId } },
            role: { connect: { id: proprietaireRole.id } },
          })),
        },
      },
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        personnes: { include: { personne: true, role: true } },
        realisations: true,
      },
    });

    return NextResponse.json(structure, { status: 201 });
  } catch (error: any) {
    console.error("Erreur création structure:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}


/**
 * GET /api/structures
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const categoriesParam = searchParams.get("cats");
    const departementParam = searchParams.get("deps");
    const waitingParam = searchParams.get("waiting");
    const searchParam = searchParams.get("search")?.toLowerCase();

    let categoryIds: number[] | undefined;
    let departementIds: number[] | undefined;
    let waiting: boolean | undefined;


    if (categoriesParam) {
      categoryIds = categoriesParam
        .split(",")
        .map(Number)
        .filter(n => !isNaN(n));
    }

    if (departementParam) {
      departementIds = departementParam
        .split(",")
        .map(Number)
        .filter(n => !isNaN(n));
    }

    if (waitingParam !== null) {
      waiting = waitingParam === "true";
    }

    const where: Prisma.StructureWhereInput = {
      ...(waiting !== undefined ? { waiting } : {}),
      ...(departementIds?.length
        ? {
          departements: {
            some: { departementId: { in: departementIds } },
          },
        }
        : {}),

      ...(categoryIds?.length
        ? {
          cats: {
            some: { categorieId: { in: categoryIds } },
          },
        }
        : {}),

      ...(searchParam
        ? {
          nomStructSearch: {
            contains: searchParam,
          },
        }
        : {}),
    };

    const structures = await prisma.structure.findMany({
      where,
      include: {
        departements: { include: { departement: true } },
        cats: { include: { categorie: true } },
        realisations: true,
        personnes: {
          include: {
            personne: true,
          },
        },
      },
      orderBy: { id: "asc" },
    });

    return NextResponse.json(
      structures.map(serializeStructure),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur GET /api/structures :", error);
    return NextResponse.json(
      { error: "Impossible de récupérer les structures" },
      { status: 500 }
    );
  }
}
