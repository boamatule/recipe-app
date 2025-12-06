import { Router } from "express";
import fetch from "node-fetch";

type CacheEntry<T> = { data: T; expiry: number };

const CACHE_TTL_MS = 1000 * 60 * 30; // 30 minutes for categories

export const mealdbRouter = Router();

const apiBase =
	process.env.MEALDB_API_BASE || "https://www.themealdb.com/api/json/v1";
const apiKey = process.env.MEALDB_API_KEY || "1";

let categoriesCache: CacheEntry<unknown> | null = null;

async function proxyRequest(path: string, searchParams?: URLSearchParams) {
	const url = new URL(`${apiBase}/${apiKey}/${path}`);
	if (searchParams) {
		url.search = searchParams.toString();
	}
	const response = await fetch(url.toString());
	if (!response.ok) {
		const text = await response.text();
		throw new Error(`Upstream error ${response.status}: ${text}`);
	}
	return response.json();
}

mealdbRouter.get("/search", async (req, res) => {
	try {
		const q = (req.query.q as string) || "";
		const data = await proxyRequest(
			"search.php",
			new URLSearchParams({ s: q }),
		);
		res.set("Cache-Control", "private, max-age=60");
		res.json(data);
	} catch (err) {
		res.status(502).json({ error: "Failed to search meals" });
	}
});

mealdbRouter.get("/meal/:id", async (req, res) => {
	try {
		const data = await proxyRequest(
			"lookup.php",
			new URLSearchParams({ i: req.params.id }),
		);
		res.set("Cache-Control", "private, max-age=120");
		res.json(data);
	} catch (err) {
		res.status(502).json({ error: "Failed to fetch meal" });
	}
});

mealdbRouter.get("/categories", async (_req, res) => {
	try {
		const now = Date.now();
		if (categoriesCache && categoriesCache.expiry > now) {
			res.set("Cache-Control", "public, max-age=600");
			return res.json(categoriesCache.data);
		}
		const data = await proxyRequest("categories.php");
		categoriesCache = { data, expiry: now + CACHE_TTL_MS };
		res.set("Cache-Control", "public, max-age=600");
		res.json(data);
	} catch (err) {
		res.status(502).json({ error: "Failed to fetch categories" });
	}
});

mealdbRouter.get("/filter", async (req, res) => {
	try {
		const category = (req.query.c as string) || "";
		const data = await proxyRequest(
			"filter.php",
			new URLSearchParams({ c: category }),
		);
		res.set("Cache-Control", "private, max-age=120");
		res.json(data);
	} catch (err) {
		res.status(502).json({ error: "Failed to filter meals" });
	}
});

mealdbRouter.get("/random", async (_req, res) => {
	try {
		const data = await proxyRequest("random.php");
		res.set("Cache-Control", "private, max-age=30");
		res.json(data);
	} catch (err) {
		res.status(502).json({ error: "Failed to fetch random meal" });
	}
});
