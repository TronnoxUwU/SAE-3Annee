import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { NextResponse } from "next/server";


function getWeekNumber(date: Date) {
  const firstJan = new Date(date.getFullYear(), 0, 1);
  const diff = date.getTime() - firstJan.getTime();
  return Math.ceil((diff / 86400000 + firstJan.getDay() + 1) / 7);
}

/**
 * ----- GET /api/traffic -----
 *  param -> range=int
 * Récupère le traffic du site
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "day";

  const visits = await prisma.analytics.findMany({
    select: { dateVisite: true },
  });

  const map = new Map<string, number>();

  visits.forEach(v => {
    const d = new Date(v.dateVisite);
    let label = "";

    if (period === "day") {
      label = d.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
      });
    }

    if (period === "week") {
      const week = getWeekNumber(d);
      label = `Semaine ${week}`;
    }

    if (period === "month") {
      label = d.toLocaleDateString("fr-FR", { month: "long" });
    }

    map.set(label, (map.get(label) || 0) + 1);
  });

  const data = Array.from(map.entries()).map(([label, visits]) => ({
    label,
    visits,
  }));

  return NextResponse.json(data);
}

