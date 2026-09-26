import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { SearchFilters, SortSelect } from "@/components/search-filters";
import { cardSurface } from "@/components/ui/card";
import { listBrands, listCategories, listProductCards } from "@/lib/queries";
import { parseSearchFilters, searchHref } from "@/lib/search-params";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseSearchFilters(await searchParams);
  const [products, categories, brands] = await Promise.all([
    listProductCards(filters),
    listCategories(),
    listBrands(filters.category || undefined),
  ]);
  const categoryName = categories.find((category) => category.slug === filters.category)?.name;
  const heading = filters.q ? `Results for “${filters.q}”` : categoryName ?? "All products";

  return (
    <div className="grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className={cn(cardSurface, "p-4")}>
        <SearchFilters filters={filters} categories={categories} brands={brands} />
      </aside>
      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{heading}</h1>
            <p className="text-sm text-muted-foreground">{products.length} results</p>
          </div>
          <SortSelect filters={filters} />
        </div>
        <ActiveFilters filters={filters} categoryName={categoryName} />
        {products.length === 0 ? (
          <div className={cn(cardSurface, "border border-dashed border-border p-8")}>
            <p className="font-medium">No products match those filters.</p>
            <Link href="/search" className="mt-2 inline-block text-sm text-primary">
              Clear filters
            </Link>
          </div>
        ) : (
          <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function ActiveFilters({
  filters,
  categoryName,
}: {
  filters: ReturnType<typeof parseSearchFilters>;
  categoryName?: string;
}) {
  const chips: { label: string; href: string }[] = [];
  if (categoryName) chips.push({ label: categoryName, href: searchHref({ ...filters, category: "" }) });
  for (const brand of filters.brands) {
    chips.push({
      label: brand,
      href: searchHref({ ...filters, brands: filters.brands.filter((item) => item !== brand) }),
    });
  }
  if (filters.rating) chips.push({ label: `${filters.rating} stars & up`, href: searchHref({ ...filters, rating: null }) });
  if (filters.minDollars != null || filters.maxDollars != null) {
    chips.push({
      label: `$${filters.minDollars ?? 0}–$${filters.maxDollars ?? ""}`,
      href: searchHref({ ...filters, minDollars: null, maxDollars: null }),
    });
  }
  if (chips.length === 0) return null;
  return (
    <ul className="mb-4 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <li key={chip.label}>
          <Link href={chip.href} className="rounded-full bg-card px-3 py-1 text-sm text-foreground shadow-sm ring-1 ring-border">
            {chip.label} ×
          </Link>
        </li>
      ))}
    </ul>
  );
}
