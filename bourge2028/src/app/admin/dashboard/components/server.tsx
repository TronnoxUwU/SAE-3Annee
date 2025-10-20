import { prisma } from "@/lib/prisma";
import DashboardChart from "./chart";

const pageNames: Record<string, string> = {
  "/": "Carte d'accueil",
};

export default async function DashboardServer() {
  const data = await prisma.analytics.groupBy({
    by: ["page"],
    where: {
      NOT: {
        page: { contains: 'admin' }
      }
    },
    _count: { page: true },
    orderBy: { _count: { page: "desc" } }
  });
  
  const chartData = data.map((d) => ({
    page: pageNames[d.page] || d.page,
    visits: d._count.page,
  }));

  return (
    <section className="p-6">
      <h1 className="text-xl font-bold mb-4">Pages les plus consultées</h1>
      <DashboardChart data={chartData} />
    </section>
  );
}
