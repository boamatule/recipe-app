import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import type { Meal } from "../lib/api";
import { cn } from "../lib/utils";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

type Props = {
	meal: Meal;
	onToggleFavorite: (meal: Meal) => void;
	favorite: boolean;
};

export function MealCard({ meal, onToggleFavorite, favorite }: Props) {
	return (
		<Card className="flex h-full min-h-[320px] flex-col overflow-hidden transition hover:shadow-md">
			<Link
				to={`/meal/${meal.idMeal}`}
				className="relative block aspect-video overflow-hidden"
			>
				{meal.strMealThumb ? (
					<img
						src={meal.strMealThumb}
						alt={meal.strMeal}
						width={480}
						height={270}
						className="h-full w-full object-cover transition duration-200 hover:scale-105"
						loading="lazy"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
						No image
					</div>
				)}
			</Link>
			<CardHeader className="flex flex-row items-start justify-between gap-3">
				<CardTitle className="line-clamp-2 text-base leading-tight">
					<Link to={`/meal/${meal.idMeal}`} className="hover:underline">
						{meal.strMeal}
					</Link>
				</CardTitle>
				<Button
					variant="ghost"
					size="icon"
					aria-pressed={favorite}
					aria-label={favorite ? "Unfavorite" : "Favorite"}
					onClick={() => onToggleFavorite(meal)}
					className="hover:bg-orange-50 dark:hover:bg-orange-500/10"
				>
					<Heart className={cn("h-5 w-5", "fill-orange-500 text-orange-500")} />
				</Button>
			</CardHeader>
			<CardContent className="flex flex-1 flex-wrap items-center gap-2">
				{meal.strCategory ? <Badge>{meal.strCategory}</Badge> : null}
				{meal.strArea ? <Badge variant="outline">{meal.strArea}</Badge> : null}
			</CardContent>
		</Card>
	);
}
