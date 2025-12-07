import { fetchUpstream, jsonResponse } from "./_utils";

export const config = { runtime: "edge" };

export default async function handler() {
  try {
    const data = await fetchUpstream("random.php");
    return jsonResponse(data);
  } catch (err: any) {
    return jsonResponse({ error: err?.message || "Failed to fetch random meal" }, 502);
  }
}

