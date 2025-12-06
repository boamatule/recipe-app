import { useEffect, useState } from "react";
import type { Meal } from "../lib/api";
import { getAllFavorites, getFavorite, removeFavorite, saveFavorite } from "../features/favorites/db";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function refresh() {
      setLoading(true);
      const data = await getAllFavorites();
      setFavorites(data);
      setLoading(false);
    }
    refresh();
  }, []);

  const isFavorite = (id: string) => favorites.some((m) => m.idMeal === id);

  async function toggleFavorite(meal: Meal) {
    const exists = await getFavorite(meal.idMeal);
    if (exists) {
      await removeFavorite(meal.idMeal);
      setFavorites((prev) => prev.filter((m) => m.idMeal !== meal.idMeal));
    } else {
      await saveFavorite(meal);
      setFavorites((prev) => [...prev, meal]);
    }
  }

  return { favorites, loading, isFavorite, toggleFavorite };
}

