import { proxy } from "./_utils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { searchParams, pathname } = new URL(req.url);
  const fromQuery = searchParams.get("id") || searchParams.get("i");
  const maybePathId = pathname.split("/").pop();
  const id = fromQuery || maybePathId || "";
  if (!id) {
    return new Response(JSON.stringify({ error: "Missing id" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
  return proxy("lookup.php", { i: id });
}

