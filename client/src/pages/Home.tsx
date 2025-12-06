import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getCategories, getByCategory, searchMeals, type Meal } from "../lib/api";
import { CategoryChips } from "../components/CategoryChips";
import { MealCard } from "../components/MealCard";
import { MealSkeleton } from "../components/MealSkeleton";
import { useFavorites } from "../hooks/useFavorites";
import { Button } from "../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card";
import { toast } from "sonner";

export default function Home() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q") ?? "";
  const category = params.get("c");
  const { favorites, isFavorite, toggleFavorite, loading: favLoading } = useFavorites();

  const DEFAULT_CATEGORY = "Beef";
  const activeCategory = category ?? DEFAULT_CATEGORY;

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60 * 6, // 6 hours cache to avoid slow reloads
    cacheTime: 1000 * 60 * 60 * 6,
    refetchOnWindowFocus: false,
  });

  const mealsQuery = useQuery({
    queryKey: ["meals", { query, category: activeCategory }],
    queryFn: async () => {
      if (query) return searchMeals(query);
      return getByCategory(activeCategory);
    },
    enabled: Boolean(activeCategory) || Boolean(query),
  });

  const meals: Meal[] = useMemo(() => mealsQuery.data?.meals ?? [], [mealsQuery.data]);

  function handleSelectCategory(next: string) {
    const copy = new URLSearchParams(params);
    copy.set("c", next);
    navigate({ pathname: "/", search: copy.toString() });
  }

  async function handleToggle(meal: Meal) {
    const wasFavorite = isFavorite(meal.idMeal);
    await toggleFavorite(meal);
    toast.success(wasFavorite ? "Removed favorite" : "Saved to favorites");
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <div>
            <CardTitle className="text-2xl">Discover recipes</CardTitle>
            <p className="text-sm text-muted-foreground">Browse by category or search any dish.</p>
          </div>
          <Button variant="outline" onClick={() => navigate("/favorites")}>
            View favorites
          </Button>
        </CardHeader>
        <CardContent>
          {categoriesQuery.isLoading ? (
            <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <MealSkeleton key={i} />
              ))}
            </div>
          ) : categoriesQuery.data?.categories ? (
            <div className="rounded-lg bg-muted/30 p-3">
              <CategoryChips
                categories={categoriesQuery.data.categories}
                active={activeCategory}
                onSelect={handleSelectCategory}
              />
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl">
            {query ? `Results for “${query}”` : `Category: ${activeCategory}`}
          </CardTitle>
          {mealsQuery.isFetching ? <span className="text-sm text-muted-foreground">Loading…</span> : null}
        </CardHeader>
        <CardContent>
          {mealsQuery.isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <MealSkeleton key={i} />
              ))}
            </div>
          ) : meals.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((meal) => (
                <MealCard
                  key={meal.idMeal}
                  meal={meal}
                  favorite={isFavorite(meal.idMeal)}
                  onToggleFavorite={handleToggle}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
              No recipes found. Try another search or category.
            </div>
          )}
        </CardContent>
      </Card>

      {favLoading ? null : favorites.length > 0 ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Your favorites (offline)</h3>
            <Button variant="ghost" onClick={() => navigate("/favorites")}>
              Manage
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.slice(0, 3).map((meal) => (
              <MealCard
                key={meal.idMeal}
                meal={meal}
                favorite
                onToggleFavorite={async (m) => {
                  await toggleFavorite(m);
                  toast.success("Removed favorite");
                }}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

