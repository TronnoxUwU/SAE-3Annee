import prisma from "@/lib/prisma";
import { serializeTechnique } from "@/lib/serializers";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/technique/[id] -----
 */
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const techniqueId = Number(id);

        if (isNaN(techniqueId)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const technique = await prisma.technique.findUnique({
            where: { id: techniqueId },
        });

        if (!technique) {
            return NextResponse.json({ error: "Technique introuvable" }, { status: 404 });
        }

        return NextResponse.json(serializeTechnique(technique), { status: 200 });
    } catch (error) {
        console.error("Erreur GET /api/technique :", error);
        return NextResponse.json(
            { error: "Impossible de récupérer la technique" },
            { status: 500 }
        );
    }
}

/**
 * ---- PUT /api/technique/[id] -----
 * Met à jour une technique existante 
 */
export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const techniqueId = Number(id);
        if (isNaN(techniqueId)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        const body = await req.json();
        const { nom, description } = body;
        if (!nom || typeof nom !== "string" || nom.trim() === "") {
            return NextResponse.json({ error: "Nom invalide" }, { status: 400 });
        }
        if (!description || typeof description !== "string" || description.trim() === "") {
            return NextResponse.json({ error: "Description invalide" }, { status: 400 });
        }

        const updatedTechnique = await prisma.technique.update({
            where: { id: techniqueId },
            data: { nom, description },
        });

        return NextResponse.json(serializeTechnique(updatedTechnique), { status: 200 });
    } catch (error: any) {
        console.error("Erreur PUT /api/technique/[id] :", error);
        return NextResponse.json(
            { error: "Impossible de mettre à jour la technique" },
            { status: 500 }
        );
    }
}

/**
 * ---- DELETE /api/technique/[id] -----
 * Supprime une technique existante 
 */
export async function DELETE(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const techniqueId = Number(id);

        if (isNaN(techniqueId)) {
            return NextResponse.json({ error: "ID invalide" }, { status: 400 });
        }

        await prisma.technique.delete({
            where: { id: techniqueId },
        });

        return NextResponse.json(
            { message: "Technique supprimée avec succès" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur DELETE /api/technique/[id] :", error);
        return NextResponse.json(
            { error: "Impossible de supprimer la technique" },
            { status: 500 }
        );
    }
}