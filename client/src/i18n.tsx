import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Locale = "en" | "pt" | "nb";

type Messages = Record<string, string>;

const translations: Record<Locale, Messages> = {
  en: {
    appTitle: "Holy Recipes",
    searchPlaceholder: "Search recipes...",
    search: "Search",
    favorites: "Favorites",
    home: "Home",
    discoverTitle: "Discover recipes",
    discoverSubtitle: "Browse by category or search any dish.",
    viewFavorites: "View favorites",
    categoryLabel: "Category",
    resultsFor: "Results for",
    latest: "Latest recipes",
    loading: "Loading…",
    empty: "No recipes found. Try another search or category.",
    favoritesTitle: "Your favorites (offline)",
    manage: "Manage",
    notFound: "Recipe not found. It may be unavailable offline.",
    instructions: "Instructions",
    ingredients: "Ingredients",
    tags: "Tags",
    favorite: "Favorite",
    unfavorite: "Unfavorite",
    watchOnYoutube: "Watch on YouTube",
    copyright: "All rights reserved.",
  },
  pt: {
    appTitle: "Holy Recipes",
    searchPlaceholder: "Buscar receitas...",
    search: "Buscar",
    favorites: "Favoritos",
    home: "Início",
    discoverTitle: "Descubra receitas",
    discoverSubtitle: "Navegue por categoria ou pesquise qualquer prato.",
    viewFavorites: "Ver favoritos",
    categoryLabel: "Categoria",
    resultsFor: "Resultados para",
    latest: "Receitas recentes",
    loading: "Carregando…",
    empty: "Nenhuma receita encontrada. Tente outra busca ou categoria.",
    favoritesTitle: "Seus favoritos (offline)",
    manage: "Gerenciar",
    notFound: "Receita não encontrada. Pode estar indisponível offline.",
    instructions: "Instruções",
    ingredients: "Ingredientes",
    tags: "Tags",
    favorite: "Favoritar",
    unfavorite: "Desfavoritar",
    watchOnYoutube: "Assistir no YouTube",
    copyright: "Todos os direitos reservados.",
  },
  nb: {
    appTitle: "Holy Recipes",
    searchPlaceholder: "Søk etter oppskrifter...",
    search: "Søk",
    favorites: "Favoritter",
    home: "Hjem",
    discoverTitle: "Oppdag oppskrifter",
    discoverSubtitle: "Bla etter kategori eller søk etter en rett.",
    viewFavorites: "Se favoritter",
    categoryLabel: "Kategori",
    resultsFor: "Resultater for",
    latest: "Siste oppskrifter",
    loading: "Laster…",
    empty: "Ingen oppskrifter funnet. Prøv et annet søk eller kategori.",
    favoritesTitle: "Dine favoritter (offline)",
    manage: "Administrer",
    notFound: "Oppskrift ikke funnet. Kan være utilgjengelig offline.",
    instructions: "Instruksjoner",
    ingredients: "Ingredienser",
    tags: "Tagger",
    favorite: "Favoritt",
    unfavorite: "Fjern favoritt",
    watchOnYoutube: "Se på YouTube",
    copyright: "Alle rettigheter reservert.",
  },
};

type I18nContextValue = {
  locale: Locale;
  t: (key: keyof Messages) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const preferred = navigator.languages?.[0] || navigator.language || "en";
  const normalized = preferred.toLowerCase();
  if (normalized.startsWith("pt")) return "pt";
  if (normalized.startsWith("nb") || normalized.startsWith("no")) return "nb";
  return "en";
}

export function TranslationProvider({ children }: { children: React.ReactNode }) {
  const [locale] = useState<Locale>(detectLocale);
  const messages = translations[locale] || translations.en;

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      t: (key: keyof Messages) => messages[key] || translations.en[key] || key,
    }),
    [locale, messages]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within TranslationProvider");
  return ctx;
}

