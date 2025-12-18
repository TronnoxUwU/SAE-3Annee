export const PAGE_NAME_MAP: Record<string, string> = {
  "/": "Accueil",

  "/articles": "Articles",
  "/article/[id]": "Article (détail)",

  "/annuaires/articles": "Annuaire des articles",
  "/annuaires/cartes": "Annuaire des cartes",
  "/annuaires/projets": "Annuaire des projets",
  "/annuaires/projets/[id]": "Projet (détail)",

  "/structure": "Structures",
  "/structure/[id]": "Structure (détail)",
  "/structure/[id]/edit": "Structure (édition)",
  "/structure/[id]/articles": "Articles d'une structure",
  "/structure/[id]/articles/[id]": "Article d'une structure (détail)",
  "/structure/projets": "Projets par structure",

  "/account/[id]": "Compte utilisateur",

  "/contact": "Contact",
  "/credit": "Crédits",
  "/information": "Informations",
  "/legal": "Mentions légales",
  "/inscription": "Inscription",
  "/reset-password": "Réinitialisation du mot de passe",
};

export function resolvePageName(path: string): string {
  if (!path || path.startsWith("/admin") || path.startsWith("/api")) {
    return "";
  }

  const normalizedPath = path
    .split("/")
    .map(seg => {
      if (/^\d+$/.test(seg)) return "[id]";
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(seg)) return "[id]";
      return seg;
    })
    .join("/");

  // fallback vers map
  return PAGE_NAME_MAP[normalizedPath] || path;
}
