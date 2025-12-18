import { NextResponse } from "next/server";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/app/api/auth/authOptions";
import {AuthAdmin} from "@/app/api/api-protection"
import prisma from "@/lib/prisma";
import { serializePersonne } from "@/lib/serializers";

/**
 * GET /api/users
 * Liste des utilisateurs
 */
export async function GET() {
  try {

    const isAdmin = await AuthAdmin()
    if (isAdmin & !isAdmin.access){
        return isAdmin;
    }
    else if (!isAdmin) {
        return NextResponse.json(
            { error: "Erreur authentification/serveur" },
            { status: 500 }
        );
    }

    const personnes = await prisma.personne.findMany({
      orderBy: {
        dateCreation: "desc",
      },
      include: {
        structures: {
          include: {
            structure: true,
          },
        },
      },
    });

    // Suppression des mots de passe + sérialisation
    const safePersonnes = personnes.map(({ password, ...p }) =>
      serializePersonne(p)
    );

    return NextResponse.json(safePersonnes);
  } catch (error) {
    console.error("Erreur GET /api/users :", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
