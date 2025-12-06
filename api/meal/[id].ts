import { proxy } from "../_utils";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  const { pathname } = new URL(req.url);
  const id = pathname.split("/").pop() || "";
  return proxy("lookup.php", { i: id });
}

