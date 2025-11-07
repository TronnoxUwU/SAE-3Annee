import prisma from "@/lib/prisma";
import { serializeTechnique } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/technique/ -----
 */
export async function GET() {
    try {
        const techniques = await prisma.technique.findMany({
            orderBy: { id: "asc" },
        });

        const serializedTechniques = techniques.map(serializeTechnique);

        return NextResponse.json(serializedTechniques, { status: 200 });
    } catch (error) {
        console.error("Erreur GET /api/technique :", error);
        return NextResponse.json(
            { error: "Impossible de récupérer les techniques" },
            { status: 500 }
        );
    }
}

/**
 * ----- POST /api/technique -----
 * Crée une nouvelle technique
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

        const technique = await prisma.technique.create({
            data: { nom, description },
        });

        return NextResponse.json(serializeTechnique(technique), {
            status: 201,
        });
    } catch (error: any) {
        console.error("Erreur création technique:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}