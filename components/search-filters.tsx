"use client";

import type { ReactNode } from "react";
import { searchHref } from "@/lib/search-params";
import type { SearchFilters } from "@/lib/types";

export function SearchFilters({
  filters,
  categories,
  brands,
}: {
  filters: SearchFilters;
  categories: { slug: string; name: string }[];
  brands: string[];
}) {
  return (
    <form action="/search" className="space-y-6 text-sm">
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      <div>
        <p className="font-semibold">Department</p>
        <div className="mt-2 space-y-1">
          <FilterLink active={!filters.category} href={searchHref({ ...filters, category: "" })}>
            All
          </FilterLink>
          {categories.map((category) => (
            <FilterLink
              key={category.slug}
              active={filters.category === category.slug}
              href={searchHref({ ...filters, category: category.slug, brands: [] })}
            >
              {category.name}
            </FilterLink>
          ))}
        </div>
      </div>
      <fieldset>
        <legend className="font-semibold">Brand</legend>
        <div className="mt-2 space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center gap-2">
              <input type="checkbox" name="brand" value={brand} defaultChecked={filters.brands.includes(brand)} />
              {brand}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">Price</legend>
        <div className="mt-2 flex items-center gap-2">
          <input
            name="min"
            inputMode="decimal"
            defaultValue={filters.minDollars ?? ""}
            placeholder="Min"
            className="h-9 w-20 rounded-md border border-[#888] px-2"
          />
          <span>to</span>
          <input
            name="max"
            inputMode="decimal"
            defaultValue={filters.maxDollars ?? ""}
            placeholder="Max"
            className="h-9 w-20 rounded-md border border-[#888] px-2"
          />
        </div>
      </fieldset>
      <fieldset>
        <legend className="font-semibold">Customer rating</legend>
        <div className="mt-2 space-y-1">
          {[4, 3, 2, 1].map((rating) => (
            <label key={rating} className="flex items-center gap-2">
              <input type="radio" name="rating" value={rating} defaultChecked={filters.rating === rating} />
              {rating} stars & up
            </label>
          ))}
        </div>
      </fieldset>
      <button type="submit" className="h-9 rounded-md bg-[#f5b942] px-3 font-medium text-[#111]">
        Apply
      </button>
    </form>
  );
}

function FilterLink({ href, active, children }: { href: string; active: boolean; children: ReactNode }) {
  return (
    <a href={href} className={`block rounded px-1 py-1 ${active ? "font-semibold text-[#111]" : "text-[#1a5276]"}`}>
      {children}
    </a>
  );
}

export function SortSelect({ filters }: { filters: SearchFilters }) {
  return (
    <form action="/search" className="flex items-center gap-2 text-sm">
      {filters.q ? <input type="hidden" name="q" value={filters.q} /> : null}
      {filters.category ? <input type="hidden" name="category" value={filters.category} /> : null}
      {filters.brands.map((brand) => (
        <input key={brand} type="hidden" name="brand" value={brand} />
      ))}
      {filters.minDollars != null ? <input type="hidden" name="min" value={filters.minDollars} /> : null}
      {filters.maxDollars != null ? <input type="hidden" name="max" value={filters.maxDollars} /> : null}
      {filters.rating ? <input type="hidden" name="rating" value={filters.rating} /> : null}
      <label htmlFor="sort">Sort by</label>
      <select
        id="sort"
        name="sort"
        defaultValue={filters.sort}
        onChange={(event) => event.currentTarget.form?.requestSubmit()}
        className="h-9 rounded-md border border-[#888] bg-white px-2"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to high</option>
        <option value="price-desc">Price: High to low</option>
        <option value="rating">Avg. customer review</option>
        <option value="newest">Newest</option>
      </select>
    </form>
  );
}
