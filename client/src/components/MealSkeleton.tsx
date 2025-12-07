import { Skeleton } from "./ui/skeleton";

export function MealSkeleton() {
	return (
    <div className="flex h-full min-h-[320px] flex-col space-y-3">
      <Skeleton className="aspect-video w-full rounded-lg" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex-1" />
    </div>
	);
}
