import type { Category } from "../lib/api";
import { Button } from "./ui/button";

type Props = {
  categories: Category[];
  active?: string;
  onSelect: (category: string) => void;
};

export function CategoryChips({ categories, active, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <Button
          key={c.idCategory}
          size="sm"
          variant={active === c.strCategory ? "secondary" : "ghost"}
          aria-pressed={active === c.strCategory}
          onClick={() => onSelect(c.strCategory)}
          className="gap-2"
        >
          {c.strCategory}
        </Button>
      ))}
    </div>
  );
}

