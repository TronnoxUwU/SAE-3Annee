import prisma from "@/lib/prisma";
import { serializeProjet } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/projet -----
 */
export async function GET(
    try {
    const projet = await prisma.projet.findMany({
        orderBy: { id: "asc" },
    });

    const serializedProjets = projet.map(serializeProjet);

    return NextResponse.json(serializedProjets, { status: 200 });
} catch (error) {
    console.error("Erreur GET /api/projet :", error);
    return NextResponse.json(
        { error: "Impossible de récupérer les projets" },
        { status: 500 }
    );
}
}

/**
 * ----- POST /api/projet -----
 * Crée un nouveau projet
 */
export async function POST(req: Request) {
    try {
        const { nom, description } = await req.json();

        if (!nom || !description) {
            return NextResponse.json(
                { error: "Nom et description sont requis" },
                { status: 400 }
            );
        }

        const projet = await prisma.projet.create({
            data: { nom, description },
        });

        return NextResponse.json(serializeProjet(projet), {
            status: 201,
        });
    } catch (error: any) {
        console.error("Erreur création projet:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}