import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { page } = data;

    const access = await prisma.analytics.findMany({
      take: 1,
      where: {
        ipAddress: req.headers.get("x-forwarded-for") || "unknown",
        page: page
      },
      orderBy: { dateVisite: 'desc' },
      select: { dateVisite: true }
    });

    if (!access.length || access[0].dateVisite.getTime() <= Date.now() - 30*60*1000) {

      await prisma.analytics.create({
        data: {
          page,
          ipAddress: req.headers.get("x-forwarded-for") || "unknown",
          userAgent: req.headers.get("user-agent") || "unknown",
        },
      });

    };

    return Response.json({ success: true });
  } catch (err) {
    console.error("Erreur Analytics:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
