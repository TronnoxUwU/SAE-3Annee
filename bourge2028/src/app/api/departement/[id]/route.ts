import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {serializeDepartement} from "@/lib/serializers";
import {deserializeDepartement} from "@/lib/deserializers";

/**
 * GET /api/departement/[id]
 */
export async function GET(
    _req: Request,
    {params}: { params: Promise<{ id: string }> }

) {
    try {
        const tmp = await params;
        const id = Number(tmp.id);

        const departement = await prisma.departement.findUnique({
            where: {id: Number(id)},
        });

        if (!departement) {
            return NextResponse.json(
                {error: "Département non trouvé"},
                {status: 404}
            );
        }

        return NextResponse.json(serializeDepartement(departement), {status: 200});
    } catch (error) {
        console.error("Erreur GET /api/departement/[id] :", error);
        return NextResponse.json(
            {error: "Impossible de récupérer le département"},
            {status: 500}
        );
    }
}

/**
 * PUT /api/departement/[id]
 */
export async function PUT(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {

        const {id} = await context.params;
        const body = await req.json();
        const data = deserializeDepartement(body);

        const departement = await prisma.departement.update({
            where: {id: Number(id)},
            data,
        });

        return NextResponse.json(serializeDepartement(departement), {status: 200});
    } catch (error) {
        console.error("Erreur PUT /api/departement/[id] :", error);
        return NextResponse.json(
            {error: "Impossible de mettre à jour le département"},
            {status: 500}
        );
    }
}

/**
 * DELETE /api/departement/[id]
 */
export async function DELETE(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const {id} = await context.params;

        await prisma.departement.delete({
            where: {id: Number(id)},
        });

        return NextResponse.json(
            {message: "Département supprimé avec succès"},
            {status: 200}
        );
    } catch (error) {
        console.error("Erreur DELETE /api/departement/[id] :", error);
        return NextResponse.json(
            {error: "Impossible de supprimer le département"},
            {status: 500}
        );
    }
}