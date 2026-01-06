import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { NextResponse } from "next/server";
import { AuthAdmin } from "@/app/api/api-protection";

/**
 * ----- GET /api/stats -----
 * Récupère les stats
 */
export async function GET() {


  const isAdmin = await AuthAdmin();

  if (!isAdmin.access) {
    const { error, status } = isAdmin as { access: false; error: string; status: number };
    return NextResponse.json({ error }, { status });
  }

  const startMonth = Number(startOfMonth(new Date()));

  const users = await prisma.personne.count();

  const uniqueVisitors = await prisma.analytics.groupBy({
    by: ['visitorHash'],
    where: {
      dateVisite: {
        gte: startMonth,
      },
    },
  });
  const visitorsMonth = uniqueVisitors.length;


  const structures = await prisma.structure.count({
    where: { waiting: false },
  });

  const cartes = await prisma.carte.count({
    where: { waiting: false },
  });

  const waiting =
    (await prisma.structure.count({ where: { waiting: true } })) +
    (await prisma.carte.count({ where: { waiting: true } }));

  return NextResponse.json({
    visitorsMonth,
    users,
    structures,
    cartes,
    waiting,
  });
}