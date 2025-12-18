import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    if (!email || !subject || !message) {
      return NextResponse.json(
        { error: "Email, subject et message sont requis." },
        { status: 400 }
      );
    }

    await sendMail(email, subject, message);

    return NextResponse.json(
      { success: true, message: "Email envoyé avec succès." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur POST /api/send-mail :", error);
    return NextResponse.json(
      { error: "Impossible d'envoyer l'email", details: (error as Error).message },
      { status: 500 }
    );
  }
}
