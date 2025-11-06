import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

// Fonction pour serializer les dates
// function serializePersonne(personne) {
//   return {
//     ...personne,
//     dateCreation: personne.dateCreation?.toISOString(),
//     structures: personne.structures?.map(app => ({
//       ...app,
//       structure: app.structure
//     })),
//     redactions: personne.redactions?.map(red => ({
//       ...red,
//       dateRedaction: red.dateRedaction?.toISOString(),
//       dateModif: red.dateModif?.toISOString()
//     }))
//   };
// }

UTILISER LE SERIALIZER

// GET - Récupérer un utilisateur
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = await params;
    const personneId = parseInt(id);

    if (isNaN(personneId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    const personne = await prisma.personne.findUnique({
      where: { id: personneId },
      include: {
        departement: true,
        structures: {
          include: {
            structure: true
          }
        },
        redactions: {
          include: {
            article: true,
            realisation: true
          }
        }
      }
    });

    if (!personne) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier que l'utilisateur peut voir ce profil
    const canView =
      session.user.id === personneId ||
      session.user.role === "Admin";

    if (!canView) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    // Ne pas renvoyer le mot de passe
    const { password, ...personneWithoutPassword } = personne;

    console.log(personne.structures[0].structure)

    return NextResponse.json(serializePersonne(personneWithoutPassword));
  } catch (error) {
    console.error("Erreur GET user:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un utilisateur
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;
    const personneId = parseInt(id);
    const body = await request.json();

    if (isNaN(personneId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Vérifier les permissions
    const canEdit =
      session.user.id === personneId ||
      session.user.role === "Admin";

    if (!canEdit) {
      return NextResponse.json(
        { error: "Accès refusé" },
        { status: 403 }
      );
    }

    // Filtrer les champs autorisés
    const updateData = {};
    
    // Champs modifiables par l'utilisateur
    const userEditableFields = ["nom", "prenom", "email"];
    userEditableFields.forEach((field) => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // Champs modifiables uniquement par les admins
    if (session.user.role === "Admin") {
      if (body.role !== undefined) updateData.role = body.role;
      if (body.departementId !== undefined) updateData.departementId = body.departementId;
    }

    // Gestion du changement de mot de passe
    if (body.newPassword && body.currentPassword) {
      const personne = await prisma.personne.findUnique({
        where: { id: personneId }
      });

      const isValid = await bcrypt.compare(body.currentPassword, personne.password);
      
      if (!isValid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Vérifier l'unicité de l'email si modifié
    if (updateData.email) {
      const existingUser = await prisma.personne.findUnique({
        where: { email: updateData.email }
      });

      if (existingUser && existingUser.id !== personneId) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    const updatedPersonne = await prisma.personne.update({
      where: { id: personneId },
      data: updateData,
      include: {
        departement: true,
        structures: {
          include: {
            structure: true
          }
        }
      }
    });

    const { password, ...personneWithoutPassword } = updatedPersonne;

    return NextResponse.json(serializePersonne(personneWithoutPassword));
  } catch (error) {
    console.error("Erreur PUT user:", error);
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Cette valeur est déjà utilisée" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur (Admin uniquement)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    if (session.user.role !== "Admin") {
      return NextResponse.json(
        { error: "Accès refusé - Admin uniquement" },
        { status: 403 }
      );
    }

    const { id } = params;
    const personneId = parseInt(id);

    if (isNaN(personneId)) {
      return NextResponse.json(
        { error: "ID invalide" },
        { status: 400 }
      );
    }

    // Supprimer les relations d'abord
    await prisma.appartenir.deleteMany({
      where: { personneId: personneId }
    });

    await prisma.rediger.deleteMany({
      where: { personneId: personneId }
    });

    // Supprimer la personne
    await prisma.personne.delete({
      where: { id: personneId }
    });

    return NextResponse.json({ 
      message: "Utilisateur supprimé avec succès" 
    });
  } catch (error) {
    console.error("Erreur DELETE user:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}