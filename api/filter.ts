import { proxy } from "./_utils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("c") || "";
  return proxy("filter.php", { c: category });
}

