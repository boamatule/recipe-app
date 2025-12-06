import { useMemo, useState } from "react";
import { useFavorites } from "../hooks/useFavorites";
import { MealCard } from "../components/MealCard";
import { Button } from "../components/ui/button";
import { MealSkeleton } from "../components/MealSkeleton";
import { toast } from "sonner";

export default function Favorites() {
  const { favorites, loading, toggleFavorite, isFavorite } = useFavorites();
  const [sort, setSort] = useState<"name" | "area">("name");

  const sorted = useMemo(() => {
    return [...favorites].sort((a, b) => {
      if (sort === "name") return a.strMeal.localeCompare(b.strMeal);
      return (a.strArea || "").localeCompare(b.strArea || "");
    });
  }, [favorites, sort]);

  if (loading)
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <MealSkeleton key={i} />
        ))}
      </div>
    );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-semibold">Your favorites</h1>
        <div className="flex items-center gap-2 text-sm">
          <span>Sort by</span>
          <Button variant={sort === "name" ? "secondary" : "ghost"} onClick={() => setSort("name")}>
            Name
          </Button>
          <Button variant={sort === "area" ? "secondary" : "ghost"} onClick={() => setSort("area")}>
            Area
          </Button>
        </div>
      </div>
      {sorted.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((meal) => (
            <MealCard
              key={meal.idMeal}
              meal={meal}
              favorite={isFavorite(meal.idMeal)}
              onToggleFavorite={async (m) => {
                const wasFavorite = isFavorite(m.idMeal);
                await toggleFavorite(m);
                toast.success(wasFavorite ? "Removed favorite" : "Saved to favorites");
              }}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
          No favorites yet. Add some recipes to view them offline.
        </div>
      )}
    </div>
  );
}

