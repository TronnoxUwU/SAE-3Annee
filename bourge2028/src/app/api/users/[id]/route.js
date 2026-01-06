import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/authOptions";
import { AuthAdmin, AuthUser } from "@/app/api/api-protection";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";
import { deserializePersonne } from "@/lib/deserializers";
import { serializePersonne } from "@/lib/serializers";

/**
 * GET /api/users/[id]
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const personneId = parseInt(id);

    const auth = await AuthUser(personneId);
    if (auth && !auth.access) {
      return NextResponse.json(auth);
    } else if (!auth) {
      return NextResponse.json(
        { error: "Erreur authentification/serveur" },
        { status: 500 }
      );
    }

    if (isNaN(personneId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const personne = await prisma.personne.findUnique({
      where: { id: personneId },
      include: {
        structures: {
          include: {
            structure: true,
          },
        },
        redactions: {
          include: {
            article: true,
          },
        },
      },
    });

    if (!personne) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    const { password, ...personneWithoutPassword } = personne;
    return NextResponse.json(serializePersonne(personneWithoutPassword));
  } catch (error) {
    console.error("Erreur GET user:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * PUT /api/users/[id]
 */
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const personneId = parseInt(id, 10);

    // Récupérer la session
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const auth = await AuthUser(personneId);
    if (auth && !auth.access) {
      return NextResponse.json(auth);
    } else if (!auth) {
      return NextResponse.json(
        { error: "Erreur authentification/serveur" },
        { status: 500 }
      );
    }

    if (isNaN(personneId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    const body = await request.json();

    // Verification user
    const canEdit =
      session.user.id === personneId || session.user.role === "Admin";
    if (!canEdit) {
      return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
    }

    const deserializedData = deserializePersonne(body);

    const updateData = {};

    // Champs modifiables par l'utilisateur
    const userEditableFields = [
      "nom",
      "prenom",
      "email",
      "description",
      "departement",
    ];
    userEditableFields.forEach((field) => {
      if (deserializedData[field] !== undefined) {
        updateData[field] = deserializedData[field];
      }
    });

    // Champs réservés à l'admin
    if (session.user.role === "Admin") {
      if (deserializedData.role !== undefined)
        updateData.role = deserializedData.role;
      if (deserializedData.departement)
        updateData.departement = deserializedData.departement;
    }

    // Mot de passe
    if (body.newPassword && body.currentPassword) {
      const personne = await prisma.personne.findUnique({
        where: { id: personneId },
      });

      const isValid = await bcrypt.compare(
        body.currentPassword,
        personne.password
      );

      if (!isValid) {
        return NextResponse.json(
          { error: "Mot de passe actuel incorrect" },
          { status: 400 }
        );
      }

      const hashedPassword = await bcrypt.hash(body.newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Verif email unique
    if (updateData.email) {
      const existingUser = await prisma.personne.findUnique({
        where: { email: updateData.email },
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
        structures: { include: { structure: true } },
        redactions: {
          include: { article: true },
        },
      },
    });

    // Supprimer le mot de passe avant envoi
    const { password, ...safePersonne } = updatedPersonne;

    return NextResponse.json(serializePersonne(safePersonne));
  } catch (error) {
    console.error("Erreur PUT /personnes :", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Cette valeur est déjà utilisée" },
        { status: 400 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/**
 * DELETE /api/users/[id]
 */
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const personneId = parseInt(id);

    const auth = await AuthUser(personneId);
    const isAdmin = await AuthAdmin(personneId);
    
    if ((auth && !auth.access) || (isAdmin && !isAdmin.access)) {
      return NextResponse.json(auth || isAdmin);
    } else if (!auth || !isAdmin) {
      return NextResponse.json(
        { error: "Erreur authentification/serveur" },
        { status: 500 }
      );
    }

    if (isNaN(personneId)) {
      return NextResponse.json({ error: "ID invalide" }, { status: 400 });
    }

    // Supprimer les relations d'abord
    await prisma.appartenir.deleteMany({
      where: { personneId: personneId },
    });

    await prisma.rediger.deleteMany({
      where: { personneId: personneId },
    });

    // Supprimer la personne
    await prisma.personne.delete({
      where: { id: personneId },
    });

    return NextResponse.json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur DELETE user:", error);

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}