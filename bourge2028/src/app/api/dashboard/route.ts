import { prisma } from "@/lib/prisma";

function getStartDate(filter: string | number): Date {
  const now = new Date();

  if (filter === "year") return new Date(now.getFullYear(), 0, 1);
  const days = typeof filter === "number" ? filter : parseInt(filter, 10);
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

const pageNames: Record<string, string> = {
  "/": "Carte d'accueil",
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filterValue = url.searchParams.get("filter") || "7";

  const startDate = getStartDate(filterValue);

  const data = await prisma.analytics.groupBy({
    by: ["page"],
    where: {
      NOT: { 
        page: { contains: "admin" } 
      },
      dateVisite: { gte: startDate },
    },
    _count: { page: true },
    orderBy: { _count: { page: "desc" } },
  });

  const chartData = data.map((d) => ({
    page: pageNames[d.page] || d.page,
    visits: d._count.page,
  }));

  return new Response(JSON.stringify(chartData), {
    headers: { "Content-Type": "application/json" },
  });
}
