import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { AuthAdmin, AuthStructureRole } from "@/app/api/api-protection";


export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId } = await request.json();

  const membre = await AuthStructureRole(Number(id), ['Proprietaire']);
  const admin = await AuthAdmin();
  
  if (!admin.access && !membre.access){
    if(!membre.access){
      return NextResponse.json(membre)
    }
    return NextResponse.json(admin)
  };

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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Récupérer les candidatures pour la structure donnée
  const candidatures = await prisma.candidature.findMany({
    where: { structureId: parseInt(id) },
    include: { personne: true },
  });
  // console.log("Candidatures récupérées :", candidatures);

  return NextResponse.json(candidatures, { status: 200 });
}