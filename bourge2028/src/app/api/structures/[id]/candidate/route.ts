import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  const { userId } = await request.json();

  // Vérifier si la structure existe
  const structure = await prisma.structure.findUnique({
    where: { id: parseInt(id) },
  });

  if (!structure) {
    return NextResponse.json({ error: "Structure not found" }, { status: 404 });
  }

  // Créer une nouvelle candidature
  const candidature = await prisma.candidature.create({
    data: {
      structureId: structure.id,
      personneId: userId,
    },
  });

  return NextResponse.json(candidature, { status: 201 });
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;

  // Récupérer les candidatures pour la structure donnée
  const candidatures = await prisma.candidature.findMany({
    where: { structureId: parseInt(id) },
    include: { personne: true },
  });
  console.log("Candidatures récupérées :", candidatures);

  return NextResponse.json(candidatures, { status: 200 });
}