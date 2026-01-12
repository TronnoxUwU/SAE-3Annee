import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import crypto from "crypto";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json(
        { error: "Email manquant" },
        { status: 400 }
      );
    }

    const user = await prisma.Personne.findUnique({
      where: { email },
    });

    // IMPORTANT : on ne révèle RIEN
    if (user) {
      const token = crypto.randomBytes(32).toString("hex");

      await prisma.Personne.update({
        where: { id: user.id },
        data: {
          resetToken: token,
          resetTokenExpires: new Date(Date.now() + 1000 * 60 * 60),
        },
      });

      const resetUrl =
        `${process.env.NEXT_PUBLIC_APP_URL}reset-password?token=${token}`;

      await sendMail(
        email,
        "Réinitialisation du mot de passe",
        `
        <p>Tu as demandé à réinitialiser ton mot de passe.</p>
        <p>Clique ici :</p>
        <a href="${resetUrl}">Réinitialiser mon mot de passe</a>
        <p>Si ce n’était pas toi, ignore ce mail.</p>
        `
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
