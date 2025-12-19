import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        const personne = await prisma.personne.findUnique({
          where: { email },
        });
        if (!personne) return null;

        const isValid = await bcrypt.compare(password, personne.password);
        if (!isValid) return null;

        const structure = await prisma.appartenir.findFirst({
          where: { personneId: personne.id },
        });

        return {
          id: personne.id,
          email: personne.email,
          nom: personne.nom,
          prenom: personne.prenom,
          role: personne.role,
          structure: structure ? structure.structureId : null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt" as const, // ✅ FIX CRITIQUE
  },

  callbacks: {
    async jwt({ token, user, trigger, session }: {
        token: any;
        user?: any;
        trigger?: "signIn" | "signUp" | "update";
        session?: any;
        }) {
        if (trigger === "update" && session?.user) {
            token.nom = session.user.nom;
            token.prenom = session.user.prenom;
            token.email = session.user.email;
        }

        if (user) {
            token.id = user.id;
            token.email = user.email;
            token.nom = user.nom;
            token.prenom = user.prenom;
            token.role = user.role;
            token.structure = user.structure;
        }

        return token;
        },


    async session({ session, token }) {
      session.user = {
        id: token.id,
        email: token.email,
        nom: token.nom,
        prenom: token.prenom,
        role: token.role,
        structure: token.structure,
      };
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
