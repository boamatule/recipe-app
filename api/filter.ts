import { fetchUpstream, jsonResponse } from "./_utils";

export const config = { runtime: "edge" };

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("c") || "";
  try {
    const data = await fetchUpstream("filter.php", { c: category });
    return jsonResponse(data);
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Failed to fetch filter" }, 502);
  }
}

