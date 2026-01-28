import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { deserializeProjet } from "@/lib/deserializers";
import { NextResponse } from "next/server";
import { AuthAdmin, AuthStructureRole } from "@/app/api/api-protection";

/**
 * ----- GET /api/projet/[id] -----
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const projetId = Number(tmp.id);
    if (isNaN(projetId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
      include: { 
        realisation: {
          include: {
            cats: { include: { categorie: true } },
            structure: true,
            articles: { include: { composants: true } },
          },
        },
        departements: { 
          include: { departement: true } 
        }
      },
    });

    if (!projet) return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });

    return NextResponse.json(serializeProjet(projet), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/projet/[id] :", error);
    return NextResponse.json({ error: "Impossible de récupérer le projet" }, { status: 500 });
  }
}

/**
 * ----- PUT /api/projet/[id] -----
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const projetId = Number(tmp.id);
    if (isNaN(projetId)) 
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await req.json();

    // 1️⃣ Récupérer le realisationId du body
    const realisationId = body?.realisation?.id;
    if (!realisationId) {
      return NextResponse.json(
        { error: "realisation.id obligatoire" },
        { status: 400 }
      );
    }

    // 2️⃣ Trouver la structure liée à la réalisation
    const result = await prisma.realisation.findUnique({
      where: { id: Number(realisationId) },
      select: {
        structure: {
          select: { id: true },
          take: 1,
          orderBy: { id: "asc" },
        },
      },
    });

    const structureId = result?.structure?.[0]?.id ?? null;
    if (!structureId) {
      return NextResponse.json(
        { error: "Réalisation ou structure introuvable" },
        { status: 404 }
      );
    }

    // 3️⃣ Sécurité
    const membre = await AuthStructureRole(structureId, ["Proprietaire"]);
    const admin = await AuthAdmin();

    if (!admin.access && !membre.access) {
      if (!membre.access) return NextResponse.json(membre);
      return NextResponse.json(admin);
    }

    // 4️⃣ Désérialiser et mettre à jour
    const projetData = deserializeProjet(body);

    const updated = await prisma.projet.update({
      where: { id: projetId },
      data: projetData,
      include: {
        realisation: {
          include: {
            cats: { include: { categorie: true } },
            structure: true,
          },
        },
        departements: { include: { departement: true } },
      },
    });

    return NextResponse.json(serializeProjet(updated), { status: 200 });
  } catch (error) {
    console.error("Erreur PUT /api/projet/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de mettre à jour le projet" },
      { status: 500 }
    );
  }
}


/**
 * ----- DELETE /api/projet/[id] -----
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const projetId = Number(tmp.id);
    if (isNaN(projetId)) 
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    // 1️⃣ Récupérer le realisationId lié au projet
    const projet = await prisma.projet.findUnique({
      where: { id: projetId },
      select: {
        realisation: {
          select: {
            structure: {
              select: { id: true },
              take: 1,
              orderBy: { id: "asc" },
            },
          },
        },
      },
    });

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    const structureId = projet.realisation?.structure?.[0]?.id ?? null;

    // 2️⃣ Sécurité
    const membre = await AuthStructureRole(structureId, ["Proprietaire"]);
    const admin = await AuthAdmin();

    if (!admin.access && !membre.access) {
      if (!membre.access) return NextResponse.json(membre);
      return NextResponse.json(admin);
    }

    // 3️⃣ Supprimer le projet
    await prisma.projet.delete({ where: { id: projetId } });

    return NextResponse.json({ message: "Projet supprimé avec succès" }, { status: 200 });
  } catch (error) {
    console.error("Erreur DELETE /api/projet/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer le projet" },
      { status: 500 }
    );
  }
}
