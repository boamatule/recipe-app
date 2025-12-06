import { proxy } from "./_utils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  return proxy("search.php", { s: q });
}

