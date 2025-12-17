import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

/**
 * ----- GET /api/stats -----
 * Récupère les stats
 */
export async function GET() {
  const startMonth = startOfMonth(new Date());

  const users = await prisma.personne.count();

  const visitorsMonth = await prisma.analytics.count({
    where: { dateVisite: { gte: startMonth } },
  });

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