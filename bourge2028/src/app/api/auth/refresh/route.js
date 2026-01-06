import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/(old) authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.personne.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      role: true,
    },
  });

  if (!user) {
    return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  return Response.json(user);
}
