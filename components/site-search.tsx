"use client";

import { useSearchParams } from "next/navigation";

export function SiteSearch() {
  const query = useSearchParams().get("q") ?? "";

  return (
    <form action="/search" className="flex min-w-0 flex-1">
      <label className="sr-only" htmlFor="site-search">
        Search Northline
      </label>
      <input
        id="site-search"
        key={query}
        name="q"
        defaultValue={query}
        placeholder="Search Northline"
        className="h-10 min-w-0 flex-1 rounded-l-md border-0 bg-white px-3 text-sm text-[#111] outline-none"
      />
      <button type="submit" className="h-10 rounded-r-md bg-[#f5b942] px-4 text-sm font-medium text-[#111]">
        Search
      </button>
    </form>
  );
}
