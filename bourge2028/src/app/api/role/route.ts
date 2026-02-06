import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
) {
    try {

        const role = await prisma.role.findMany();

        // console.log("Rôles récupérés :", role);
        return NextResponse.json(
            role,
            { status: 200 }
        );
    } catch (error) {
        console.error("Erreur GET /api/role/ :", error);
        return NextResponse.json(
            { error: "Impossible de récupérer le role sur la structure" },
            { status: 500 }
        );
    }
}