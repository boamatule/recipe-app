const API_BASE = process.env.MEALDB_API_BASE || "https://www.themealdb.com/api/json/v1";
const API_KEY = process.env.MEALDB_API_KEY || "1";

export async function proxy(path: string, params?: Record<string, string | undefined>) {
  const url = new URL(`${API_BASE}/${API_KEY}/${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v) url.searchParams.set(k, v);
    });
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    const text = await res.text();
    return new Response(JSON.stringify({ error: `Upstream ${res.status}`, detail: text }), {
      status: 502,
      headers: { "content-type": "application/json" },
    });
  }
  const json = await res.json();
  return new Response(JSON.stringify(json), {
    status: 200,
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=600",
    },
  });
}

