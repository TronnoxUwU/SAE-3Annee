import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return new Response(
        JSON.stringify({ error: "Token et mot de passe requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Vérifie le token
    const personne = await prisma.personne.findFirst({
      where: {
        resetToken: token,
        resetTokenExpires: {
          gt: new Date(),
        },
      },
    });

    if (!personne) {
      return new Response(
        JSON.stringify({ error: "Lien invalide ou expiré" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash nouveau mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Mise à jour
    await prisma.personne.update({
      where: { id: personne.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    return new Response(
      JSON.stringify({ message: "Mot de passe mis à jour" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur reset-password API:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
