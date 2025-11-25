const cache = new Map(); // clé = url, valeur = { image, timestamp }
const CACHE_DURATION = 1000 * 60 * 60; // 1h

export async function POST(req) {
  const { url } = await req.json();
  if (!url) return Response.json({ image: null });

  const now = Date.now();

  // 1. CACHE
  if (cache.has(url)) {
    const entry = cache.get(url);
    if (now - entry.timestamp < CACHE_DURATION) {
      return Response.json({ image: entry.image });
    }
  }

  // 2. FETCH EXTERNE (lent)
  try {
    const res = await fetch(url, { cache: "no-store" });
    const html = await res.text();

    const match = html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
    );
    const image = match?.[1] || null;

    // 3. ÉCRITURE DU CACHE
    cache.set(url, { image, timestamp: now });

    return Response.json({ image });
  } catch {
    return Response.json({ image: null });
  }
}
