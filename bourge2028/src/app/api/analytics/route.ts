import prisma from "@/lib/prisma";
import crypto from "crypto";

function getVisitorHash(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    "unknown";

  const agent =
    req.headers.get("user-agent") || "unknown";

  return crypto
    .createHash("sha256")
    .update(ip + agent)
    .digest("hex");
}

/**
 * ----- POST /api/analytics -----
 */
export async function POST(req: Request) {
  try {
    const { page } = await req.json();
    const visitorHash = getVisitorHash(req);

    const limitDate = Number(Date.now() - (24 * 60 * 60 * 1000))
    const autorise = page.toLowerCase().includes("admin")

    const lastVisit = await prisma.analytics.findFirst({
      where: {
        page,
        visitorHash,
        dateVisite: {
          gte: limitDate,
        },
      },
      orderBy: { dateVisite: "desc" },
      select: { id: true },
    });

    // console.log({page, visitorHash, limitDate})
    // console.log(lastVisit)

    if (!lastVisit && !autorise) {
      await prisma.analytics.create({
        data: {
          page,
          visitorHash,
          dateVisite: BigInt(Date.now()),
        },
      });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Erreur Analytics:", err);
    return new Response("Erreur serveur", { status: 500 });
  }
}
