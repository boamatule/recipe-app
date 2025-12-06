const BASE = "/api";

export type Meal = {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strMealThumb?: string;
  strTags?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: unknown;
};

export type Category = {
  idCategory: string;
  strCategory: string;
  strCategoryThumb: string;
  strCategoryDescription: string;
};

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export function searchMeals(query: string) {
  const url = new URL(`${BASE}/search`, window.location.origin);
  if (query) url.searchParams.set("q", query);
  return request<{ meals: Meal[] | null }>(url.pathname + url.search);
}

export function getMeal(id: string) {
  return request<{ meals: Meal[] | null }>(`${BASE}/meal/${id}`);
}

export function getCategories() {
  return request<{ categories: Category[] }>(`${BASE}/categories`);
}

export function getByCategory(category: string) {
  const url = new URL(`${BASE}/filter`, window.location.origin);
  url.searchParams.set("c", category);
  return request<{ meals: Meal[] | null }>(url.pathname + url.search);
}

export function getRandomMeal() {
  return request<{ meals: Meal[] | null }>(`${BASE}/random`);
}

