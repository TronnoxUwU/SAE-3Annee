import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { startOfMonth } from "date-fns";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30";

  const startDate = new Date(Date.now() - Number(range) * 86400000);

  const pages = await prisma.analytics.groupBy({
    by: ["page"],
    where: { dateVisite: { gte: startDate } },
    _count: { page: true },
    orderBy: { _count: { page: "desc" } },
    take: 10,
  });

  return NextResponse.json(
    pages.map(p => ({
      page: p.page,
      visits: p._count.page,
    }))
  );
}
