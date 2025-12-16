import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req) {
  try {
    const { identifiant, nom, prenom, email, password, role } = await req.json();

    // Validation simple des champs obligatoires
    if (!identifiant || !nom || !prenom || !email || !password) {
      return new Response(
        JSON.stringify({ error: "Tous les champs identifiant, nom, prénom, email et mot de passe sont requis" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Vérifie si l'email ou identifiant existe déjà
    const existingUser = await prisma.personne.findFirst({
      where: {
        OR: [{ email }, { identifiant }]
      }
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "Identifiant ou email déjà utilisé" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Hash du mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création utilisateur
    const personne = await prisma.personne.create({
      data: {
        identifiant,
        nom,
        prenom,
        email,
        password: hashedPassword,
        role,
      },
    });

    await sendMail(
      email,
      "Compte créé",
      `
  <p>Votre compte a été créé avec succès.</p>
  <p>Si vous n’êtes pas à l’origine de cette action, ignorez ce message.</p>
  `
    );


    return new Response(
      JSON.stringify({
        message: "Compte créé",
        personne: {
          identifiant: personne.identifiant,
          nom: personne.nom,
          prenom: personne.prenom,
          email: personne.email,
          role: personne.role,
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erreur register API:", error);
    return new Response(
      JSON.stringify({ error: "Erreur serveur" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
