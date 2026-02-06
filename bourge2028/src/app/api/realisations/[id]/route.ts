import prisma from "@/lib/prisma";
import { serializeRealisation } from "@/lib/serializers";
import { deserializeRealisation } from "@/lib/deserializers";
import { NextResponse } from "next/server";
import { AuthAdmin, AuthStructureRole } from "@/app/api/api-protection";

/**
 * ----- GET /api/realisation/[id] -----
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const realisation = await prisma.realisation.findUnique({
      where: { id: realisationId },
      include: {
        structure: true,
        cats: { include: { categorie: true } },
        projet: {
          include: {
            departements: true,
          },
        },
        materiaux: true,
        technique: true,
        articles: {
          include: {
            composants: {
              include: {
                titre: true,
                paragraphe: true,
                image: true,
                caroussels: { include: { images: true } },
              },
            },  // ✅ OBLIGATOIRE
            documents: true,
          },
        },
      },
    });


    if (!realisation) return NextResponse.json({ error: "Réalisation introuvable" }, { status: 404 });

    return NextResponse.json(serializeRealisation(realisation), { status: 200 });
  } catch (error) {
    console.error("Erreur GET /api/realisation/[id] :", error);
    return NextResponse.json({ error: "Impossible de récupérer la réalisation" }, { status: 500 });
  }
}

/**
 * ----- PUT /api/realisation/[id] -----
 */
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

    const body = await req.json();
    const realisationData = deserializeRealisation(body);

    const membre = await AuthStructureRole(body?.structure[0].id, ['Proprietaire']);
      const admin = await AuthAdmin();
      
      if (!admin.access && !membre.access){
        if(!membre.access){
          return NextResponse.json(membre)
        }
        return NextResponse.json(admin)
      };

    if (realisationData.projet?.create) {
      realisationData.projet = {
        update: realisationData.projet.create,
      } as any;
    }

    if (realisationData.technique?.create) {
      realisationData.technique = {
        update: realisationData.technique.create,
      } as any;
    }


    const updated = await prisma.realisation.update({
      where: { id: realisationId },
      data: realisationData,
    });


    return NextResponse.json(updated, { status: 200 });
  } catch (error: any) {
    console.error("Erreur PUT /api/realisations/[id] :", error);
    return NextResponse.json({ error: error.message || "Impossible de mettre à jour la réalisation" }, { status: 500 });
  }
}


export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tmp = await params;
    const realisationId = Number(tmp.id);
    if (isNaN(realisationId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // 🔎 1️⃣ Trouver la structure liée à la réalisation
    const result = await prisma.realisation.findUnique({
      where: { id: realisationId },
      select: {
        structure: {
          select: { id: true },
          take: 1,
          orderBy: { id: "asc" },
        },
      },
    });

    const structureId = result?.structure?.[0]?.id ?? null;

    // 🔐 2️⃣ Sécurité
    const membre = await AuthStructureRole(structureId, ["Proprietaire"]);
    const admin = await AuthAdmin();

    if (!admin.access && !membre.access) {
      if (!membre.access) return NextResponse.json(membre);
      return NextResponse.json(admin);
    }

    // ❌ Réalisation inexistante
    if (!result) {
      return NextResponse.json(
        { error: "Réalisation introuvable" },
        { status: 404 }
      );
    }

    // 🧹 3️⃣ Suppression transactionnelle
    await prisma.$transaction([
      prisma.materiau.deleteMany({ where: { realisationId } }),
      prisma.technique.deleteMany({ where: { realisationId } }),
      prisma.projet.deleteMany({ where: { realisationId } }),

      // articles et composants sont en cascade via le schema
      prisma.realisation.delete({ where: { id: realisationId } }),
    ]);

    return NextResponse.json(
      { message: "Réalisation supprimée avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur DELETE /api/realisation/[id] :", error);
    return NextResponse.json(
      { error: "Impossible de supprimer la réalisation" },
      { status: 500 }
    );
  }
}

