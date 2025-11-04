// /app/api/forgot-password/route.js
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

export async function POST(req) {
  const { email } = await req.json();

  const user = await prisma.Personne.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${token}`;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Réinitialisation du mot de passe",
    text: `Bonjour,\n\n
    Voici votre lien de réinitialisation : ${resetLink} \n\n
    Ce lien expirera dans une heure.\n\n
    Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.\n\n
    Merci. \n\n
    L'équipe de support.`,
  });

  return NextResponse.json({ success: true });
}
