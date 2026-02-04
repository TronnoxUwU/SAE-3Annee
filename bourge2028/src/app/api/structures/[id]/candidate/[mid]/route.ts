import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

export async function DELETE(
    request: Request,
    { params }: { params: { id: string; mid: string } }
) {
    const { id, mid } = await params;
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action"); // "accepter" | "refuser"

    if (!action || !["accepter", "refuser"].includes(action)) {
        return NextResponse.json(
            { error: "Action invalide. Utilise ?action=accepter ou ?action=refuser" },
            { status: 400 }
        );
    }

    // Vérifier si la candidature existe bien dans cette structure
    const candidature = await prisma.candidature.findUnique({
        where: {
            structureId_personneId: {
                structureId: parseInt(id),
                personneId: parseInt(mid)
            }
        },
    });

    if (!candidature) {
        return NextResponse.json(
            { error: "Candidature not found for this structure" },
            { status: 404 }
        );
    }

    const user = await prisma.personne.findUnique({
        where: { id: candidature.personneId },
    });
    
    const structure = await prisma.structure.findUnique({
        where: { id: parseInt(id) },
    });

    if (!user || !structure) {
        return NextResponse.json(
            { error: "User or structure not found" },
            { status: 404 }
        );
    }

    // Récupération du body pour roleId
    let roleId: number | null = null;
    try {
        const body = await request.json();
        roleId = body.roleId;
        console.log("Body reçu:", body);
    } catch {
        // Pas de body → normal si c'est un refus
    }
    console.log("Action:", action, "RoleId:", roleId);

    if (action === "accepter") {
        if (roleId === null) {
            return NextResponse.json(
                { error: "roleId est requis pour accepter une candidature" },
                { status: 400 }
            );
        }

        // Créer directement le membre au lieu d'appeler fetch
        await prisma.appartenir.create({
            data: {
                personneId: candidature.personneId,
                structureId: structure.id,
                roleId: roleId
            }
        });

        // Mail d'acceptation
        await sendMail(
            user.email,
            "Candidature acceptée",
            `
                <p>Votre candidature pour ${structure.nom} a été acceptée.</p>
                <p>Si ce n'était pas vous, ignorez ce mail.</p>
            `
        );
    }

    if (action === "refuser") {
        // Mail de refus
        await sendMail(
            user.email,
            "Candidature refusée",
            `
                <p>Votre candidature pour ${structure.nom} a été refusée.</p>
                <p>Si ce n'était pas vous, ignorez ce mail.</p>
            `
        );
    }

    // Suppression dans tous les cas
    await prisma.candidature.delete({
        where: {
            structureId_personneId: {
                structureId: parseInt(id),
                personneId: parseInt(mid)
            }
        }
    });

    return NextResponse.json(
        { message: `Candidature ${action === "accepter" ? "acceptée" : "refusée"} puis supprimée avec succès` },
        { status: 200 }
    );
}