import { proxy } from "../_utils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { pathname, searchParams } = new URL(req.url);
  const idFromPath = pathname.split("/").pop() || "";
  const idFromQuery = searchParams.get("id") || searchParams.get("i") || "";
  const id = idFromPath || idFromQuery;
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return proxy("lookup.php", { i: id });
}

