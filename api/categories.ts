import { fetchUpstream, jsonResponse } from "./_utils";

export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const data = await fetchUpstream("categories.php");
    return jsonResponse(data);
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Failed to fetch categories" }, 502);
  }
}

