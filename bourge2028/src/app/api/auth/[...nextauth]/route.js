import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials;
        const personne = await prisma.personne.findUnique({ where: { email } });

        if (!personne) return null;

        const isValid = await bcrypt.compare(password, personne.password);
        if (!isValid) return null;

        // Récupère la structure liée à la personne
        const structure = await prisma.appartenir.findFirst({
          where: { personneId: personne.id },
        });

        return {
          id: personne.id,
          email: personne.email,
          name: personne.name,
          role: personne.role,
          structure: structure ? structure.structureId : null,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
        token.structure = user.structure;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
          name: token.name,
          role: token.role,
          structure: token.structure,
        };
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };