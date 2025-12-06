import { proxy } from "./_utils";

export const config = {
  runtime: "edge",
};

export default async function handler() {
  return proxy("categories.php");
}

