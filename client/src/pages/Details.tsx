import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMeal, type Meal } from "../lib/api";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { MealSkeleton } from "../components/MealSkeleton";
import { Heart, Play } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";
import { toast } from "sonner";
import { useI18n } from "../i18n";

function parseIngredients(meal: Meal) {
  const items: string[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (typeof ing === "string" && ing.trim()) {
      const text = measure ? `${ing} - ${measure}` : ing;
      items.push(text);
    }
  }
  return items;
}

export default function Details() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { t } = useI18n();
  const query = useQuery({
    queryKey: ["meal", id],
    queryFn: () => getMeal(id || ""),
    enabled: Boolean(id),
  });

  if (query.isLoading) return <MealSkeleton />;
  const meal = query.data?.meals?.[0];
  if (!meal)
    return (
      <div className="rounded-lg border border-dashed border-border p-6 text-center text-muted-foreground">
        {t("notFound")}
      </div>
    );

  const ingredients = parseIngredients(meal);
  const favorite = isFavorite(meal.idMeal);
  const youtubeUrl =
    meal.strYoutube && meal.strYoutube.startsWith("http")
      ? meal.strYoutube
      : meal.strYoutube
      ? `https://www.youtube.com/watch?v=${meal.strYoutube}`
      : null;

  return (
    <article className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl font-semibold">{meal.strMeal}</h1>
            <p className="text-sm text-muted-foreground">
              {meal.strCategory} • {meal.strArea}
            </p>
          </div>
          <Button
            variant={favorite ? "secondary" : "default"}
            className="gap-2"
            onClick={async () => {
              const wasFavorite = isFavorite(meal.idMeal);
              await toggleFavorite(meal);
              toast.success(wasFavorite ? t("unfavorite") : t("favorite"));
            }}
            aria-pressed={favorite}
          >
            <Heart className="h-5 w-5" />
            {favorite ? t("unfavorite") : t("favorite")}
          </Button>
        </div>
        {meal.strMealThumb ? (
          <div className="overflow-hidden rounded-lg border border-border shadow-md">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              width={800}
              height={450}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
          </div>
        ) : null}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">{t("instructions")}</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {meal.strInstructions}
          </p>
        </section>
      </div>
      <aside className="space-y-4">
        <section className="rounded-lg border border-border p-4">
          <h3 className="text-lg font-semibold">{t("ingredients")}</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {ingredients.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
        {meal.strTags ? (
          <section className="rounded-lg border border-border p-4">
            <h3 className="text-lg font-semibold">{t("tags")}</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {meal.strTags.split(",").map((tag) => (
                <Badge key={tag.trim()}>{tag.trim()}</Badge>
              ))}
            </div>
          </section>
        ) : null}
        {youtubeUrl ? (
          <Button
            type="button"
            variant="default"
            className="w-full gap-2 shadow-sm"
            onClick={() => window.open(youtubeUrl, "_blank", "noopener,noreferrer")}
            aria-label="Watch this recipe on YouTube"
          >
            <Play className="h-4 w-4" />
            {t("watchOnYoutube")}
          </Button>
        ) : null}
      </aside>
    </article>
  );
}

