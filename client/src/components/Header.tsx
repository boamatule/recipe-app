import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Heart } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";

export default function Header() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(params.get("q") ?? "");

  useEffect(() => {
    setValue(params.get("q") ?? "");
  }, [params]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next = new URLSearchParams(params);
    if (value) next.set("q", value);
    else next.delete("q");
    navigate({ pathname: "/", search: next.toString() });
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link to="/" className="text-xl font-semibold leading-none" aria-label="Home">
            Holy Recipes
          </Link>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              className="flex items-center gap-1 text-sm"
              onClick={() => {
                if (location.pathname.startsWith("/favorites")) navigate("/");
                else navigate("/favorites");
              }}
              aria-label="Favorites"
            >
              <Heart className="h-5 w-5" />
              <span className="hidden sm:inline">
                {location.pathname.startsWith("/favorites") ? "Home" : "Favorites"}
              </span>
            </Button>
            <ThemeToggle />
          </nav>
        </div>
        <form onSubmit={onSubmit} className="flex w-full flex-1 items-center gap-2">
          <label className="sr-only" htmlFor="search">
            Search recipes
          </label>
          <Input
            id="search"
            placeholder="Search recipes..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full focus-visible:outline-orange-500"
          />
          <Button
            type="submit"
            className="whitespace-nowrap bg-orange-500 text-white hover:bg-orange-600"
          >
            Search
          </Button>
        </form>
      </div>
    </header>
  );
}

