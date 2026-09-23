import type { SearchFilters, SearchSort } from "@/lib/types";

const sorts: SearchSort[] = ["featured", "price-asc", "price-desc", "rating", "newest"];

export function parseSearchFilters(
  params: Record<string, string | string[] | undefined>,
): SearchFilters {
  const q = first(params.q).replace(/[%_]/g, "").trim();
  const category = first(params.category).trim();
  const brands = many(params.brand)
    .map((brand) => brand.trim())
    .filter(Boolean);
  const sortValue = first(params.sort);
  const sort = sorts.includes(sortValue as SearchSort) ? (sortValue as SearchSort) : "featured";
  const rating = numberOrNull(first(params.rating));
  return {
    q,
    category,
    brands,
    minDollars: numberOrNull(first(params.min)),
    maxDollars: numberOrNull(first(params.max)),
    rating: rating && rating >= 1 && rating <= 5 ? rating : null,
    sort,
  };
}

export function searchHref(filters: Partial<SearchFilters> & { q?: string }) {
  const params = new URLSearchParams();
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  for (const brand of filters.brands ?? []) params.append("brand", brand);
  if (filters.minDollars != null) params.set("min", String(filters.minDollars));
  if (filters.maxDollars != null) params.set("max", String(filters.maxDollars));
  if (filters.rating) params.set("rating", String(filters.rating));
  if (filters.sort && filters.sort !== "featured") params.set("sort", filters.sort);
  const query = params.toString();
  return query ? `/search?${query}` : "/search";
}

function first(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

function many(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return [value];
}

function numberOrNull(value: string) {
  if (!value.trim()) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
}
