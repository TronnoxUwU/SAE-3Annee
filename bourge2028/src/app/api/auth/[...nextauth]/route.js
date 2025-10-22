import NextAuth from "next-auth";
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
        const { email, password } = credentials;
        const personne = await prisma.personne.findUnique({ where: { email } });
        
        if (!personne) return null;
        
        const isValid = await bcrypt.compare(password, personne.password);
        if (!isValid) return null;

        return {
          email: personne.email,
          name: personne.name,
          role: personne.role, 
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // create token
    async jwt({ token, user }) {
      if (user) {
        token.personne = {
          email: user.email,
          name: user.name,
          role: user.role,
        };
      }
      return token;
    },
    // create session
    async session({ session, token }) {
      if (token?.personne) {
        session.personne = token.personne;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
