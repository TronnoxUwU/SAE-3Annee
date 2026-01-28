import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    console.log("=== DÉBUT DE LA REQUÊTE PUT ===");
    
    const { id, mid } = await params;
    const structureId = Number(id);
    const personneId = Number(mid);

    console.log("1. Params reçus - Structure ID :", structureId, "Personne ID :", personneId);

    if (isNaN(structureId) || isNaN(personneId)) {
      console.log("ERREUR: ID invalide");
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    console.log("2. Tentative de lecture du body...");
    const body = await req.json();
    console.log("3. Body brut reçu :", JSON.stringify(body));
    console.log("4. Type de roleId :", typeof body.roleId, "Valeur :", body.roleId);
    
    // Accepter roleId === 0
    if (body.roleId === undefined || body.roleId === null || body.roleId === '') {
      console.log("ERREUR: roleId manquant dans le body");
      return NextResponse.json(
        { error: "roleId est requis" },
        { status: 400 }
      );
    }

    const roleId = Number(body.roleId);
    console.log("5. roleId après conversion :", roleId, "isNaN ?", isNaN(roleId));

    if (isNaN(roleId)) {
      console.log("ERREUR: roleId n'est pas un nombre valide");
      return NextResponse.json(
        { error: "roleId doit être un nombre valide" },
        { status: 400 }
      );
    }

    console.log("6. Recherche du membre existant...");
    // Vérifier que l'entrée existe
    const existingMember = await prisma.appartenir.findFirst({
      where: {
        structureId: structureId,
        personneId: personneId,
      },
    });

    console.log("7. Membre existant trouvé :", existingMember);

    if (!existingMember) {
      console.log("ERREUR: Membre non trouvé");
      return NextResponse.json(
        { error: "Membre non trouvé dans cette structure" },
        { status: 404 }
      );
    }

    console.log("8. Rôle actuel :", existingMember.roleId, "Nouveau rôle :", roleId);

    // Si le rôle est le même, pas besoin de mettre à jour
    if (existingMember.roleId === roleId) {
      console.log("9. Le rôle est identique, pas de mise à jour nécessaire");
      return NextResponse.json(
        { message: "Le rôle est déjà à jour", member: existingMember },
        { status: 200 }
      );
    }

    console.log("10. Tentative de mise à jour...");
    // Utiliser updateMany pour éviter les problèmes avec la contrainte unique
    const updatedResult = await prisma.appartenir.updateMany({
      where: {
        structureId: structureId,
        personneId: personneId,
      },
      data: {
        roleId: roleId,
      },
    });

    console.log("11. Résultat de la mise à jour :", updatedResult);

    if (updatedResult.count === 0) {
      console.log("ERREUR: Aucune mise à jour effectuée");
      return NextResponse.json(
        { error: "Aucune mise à jour effectuée" },
        { status: 404 }
      );
    }

    console.log("12. Récupération du membre mis à jour...");
    // Récupérer le membre mis à jour avec les relations
    const updatedMember = await prisma.appartenir.findFirst({
      where: {
        structureId: structureId,
        personneId: personneId,
      },
      include: {
        personne: {
          select: {
            id: true,
            nom: true,
            prenom: true,
          },
        },
        role: {
          select: {
            id: true,
            nom: true,
          },
        },
      },
    });

    console.log("13. Membre mis à jour récupéré :", updatedMember);
    console.log("=== FIN DE LA REQUÊTE PUT (SUCCÈS) ===");

    return NextResponse.json(
      { 
        message: "Rôle du membre mis à jour avec succès", 
        member: updatedMember 
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("!!! ERREUR ATTRAPÉE DANS LE CATCH !!!");
    console.error("Type d'erreur:", error.constructor.name);
    console.error("Message d'erreur:", error.message);
    console.error("Stack trace complète:", error.stack);

    return NextResponse.json(
      { error: error.message || "Impossible de mettre à jour le rôle du membre" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string; mid: string }> }
) {
  try {
    const { id, mid } = await params;
    const structureId = Number(id);
    const personneId = Number(mid);

    if (isNaN(structureId) || isNaN(personneId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const deletedMember = await prisma.appartenir.deleteMany({
      where: {
        structureId: structureId,
        personneId: personneId,
      },
    });

    if (deletedMember.count === 0) {
      return NextResponse.json(
        { error: "Membre non trouvé dans cette structure" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Membre supprimé avec succès de la structure" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Erreur DELETE /api/structures/[id]/members/[mid] :", error);

    return NextResponse.json(
      { error: error.message || "Impossible de supprimer le membre de la structure" },
      { status: 500 }
    );
  }
}