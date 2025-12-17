import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { format, startOfWeek } from "date-fns";
import { fr } from "date-fns/locale";


// function getWeekNumber(date: Date) {
//   const firstJan = new Date(date.getFullYear(), 0, 1);
//   const diff = date.getTime() - firstJan.getTime();
//   return Math.ceil((diff / 86400000 + firstJan.getDay() + 1) / 7);
// }

/**
 * ----- GET /api/traffic -----
 *  param -> range=int
 * Récupère le traffic du site (nb de visiteurs uniques)
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get("period") || "day";

  // récup visites
  const visits = await prisma.analytics.findMany({
    select: {
      dateVisite: true,
      visitorHash: true,
    },
    orderBy: {
      dateVisite: 'asc'
    }
  });

  const map = new Map<string, Set<string>>();

  visits.forEach(v => {
    const timestamp = Number(v.dateVisite);
    const d = new Date(timestamp);
    
    if (isNaN(d.getTime())) return;

    let label = "";

    if (period === "day") {
      // Format: 17/12/2025
      label = format(d, "dd/MM/yyyy");
    } else if (period === "week") {
      // Format: Sem. 51 - 2025
      const start = startOfWeek(d, { weekStartsOn: 1 });
      label = `Sem. ${format(d, "II")} - ${format(d, "yyyy")}`;
    } else if (period === "month") {
      // Format: décembre 2025
      label = format(d, "MMMM yyyy", { locale: fr });
    }

    if (!map.has(label)) {
      map.set(label, new Set());
    }

    // same day, same hash = 1 personne
    map.get(label)!.add(v.visitorHash);
  });

  // Conversion pour graphqiue
  const data = Array.from(map.entries()).map(([label, visitors]) => ({
      label,
      "visiteurs uniques": visitors.size, 
    }));

  return NextResponse.json(data);
}