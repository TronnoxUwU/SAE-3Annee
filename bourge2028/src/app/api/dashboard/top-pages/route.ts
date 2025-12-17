import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { resolvePageName } from "@/lib/pages"; 

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30";

  const startDate = Number(Date.now() - Number(range) * 86400000);

  // 1. Récupération des stats de pages
  const rawPages = await prisma.analytics.groupBy({
    by: ["page"],
    where: { dateVisite: { gte: startDate } },
    _count: { page: true },
    orderBy: { _count: { page: "desc" } },
    take: 10,
  });

  // 2. Identification des IDs à récupérer
  const structureIds = new Set<number>();
  const articleIds = new Set<number>();
  const projetIds = new Set<number>();

  const REGEX_STRUCTURE = /\/structure\/(\d+)/;
  const REGEX_ARTICLE = /\/articles?\/(\d+)/; 
  const REGEX_PROJET = /\/projets?\/(\d+)/;

  rawPages.forEach((p) => {
    const sMatch = p.page.match(REGEX_STRUCTURE);
    if (sMatch) structureIds.add(parseInt(sMatch[1]));

    const aMatch = p.page.match(REGEX_ARTICLE);
    if (aMatch && !p.page.endsWith("/articles")) articleIds.add(parseInt(aMatch[1]));

    const pMatch = p.page.match(REGEX_PROJET);
    if (pMatch && !p.page.endsWith("/projets")) projetIds.add(parseInt(pMatch[1]));
  });

  // 3. Récupération des données avec les bons noms de champs (Prisma Schema)
  const [structures, articles, projets] = await Promise.all([
    structureIds.size > 0 
      ? prisma.structure.findMany({
          where: { id: { in: Array.from(structureIds) } },
          select: { id: true, nomStructure: true } // Champ correct : nomStructure
        }) 
      : [],
    articleIds.size > 0 
      ? prisma.article.findMany({
          where: { id: { in: Array.from(articleIds) } },
          select: { id: true, titre: true } // Champ correct : titre
        }) 
      : [],
    projetIds.size > 0 
      ? prisma.projet.findMany({
          where: { id: { in: Array.from(projetIds) } },
          select: { id: true, nomProjet: true } // Champ correct : nomProjet
        }) 
      : []
  ]);

  // 4. Création des Maps
  const structMap = new Map(structures.map(s => [s.id, s.nomStructure]));
  const articleMap = new Map(articles.map(a => [a.id, a.titre]));
  const projetMap = new Map(projets.map(p => [p.id, p.nomProjet]));

  // 5. Enrichissement
  const enrichedPages = rawPages.map(p => {
    let title = null;
    const path = p.page;

    // Logique Structures
    const sMatch = path.match(REGEX_STRUCTURE);
    if (sMatch) {
      const id = parseInt(sMatch[1]);
      const name = structMap.get(id);
      if (name) {
        if (path.endsWith("/edit")) title = `${name} (édition)`;
        else if (path.includes("/articles")) {
            // On vérifie si c'est un article spécifique dans la structure
            const aMatch = path.match(REGEX_ARTICLE);
            if (aMatch && path.split('/').length > 4) {
                 title = articleMap.get(parseInt(aMatch[1])) || name;
            } else {
                title = `Articles de ${name}`;
            }
        }
        else title = name;
      }
    }

    // Logique Articles & Projets (si pas déjà trouvé par structure)
    if (!title) {
        const aMatch = path.match(REGEX_ARTICLE);
        if (aMatch) title = articleMap.get(parseInt(aMatch[1]));
        
        const pMatch = path.match(REGEX_PROJET);
        if (pMatch) title = projetMap.get(parseInt(pMatch[1]));
    }

    return {
      page: path,
      visits: p._count.page,
      title: title || resolvePageName(path)
    };
  });

  return NextResponse.json(enrichedPages);
}