import { openDB } from "idb";
import type { Meal } from "../../lib/api";

const DB_NAME = "recipes-favorites";
const STORE_NAME = "favorites";
const VERSION = 1;

async function getDb() {
  return openDB(DB_NAME, VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "idMeal" });
      }
    },
  });
}

export async function saveFavorite(meal: Meal) {
  const db = await getDb();
  await db.put(STORE_NAME, meal);
}

export async function removeFavorite(idMeal: string) {
  const db = await getDb();
  await db.delete(STORE_NAME, idMeal);
}

export async function getFavorite(idMeal: string) {
  const db = await getDb();
  return db.get<Meal>(STORE_NAME, idMeal);
}

export async function getAllFavorites() {
  const db = await getDb();
  return db.getAll<Meal>(STORE_NAME);
}

