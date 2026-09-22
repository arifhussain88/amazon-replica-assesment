"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function DepartmentMenu({
  categories,
}: {
  categories: { slug: string; name: string }[];
}) {
  return (
    <Sheet>
      <SheetTrigger className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm font-semibold text-white hover:outline hover:outline-white">
        <Menu className="size-5" />
        All
      </SheetTrigger>
      <SheetContent side="left" title="Shop by department">
        <ul className="space-y-1">
          <li>
            <SheetClose asChild>
              <Link href="/search" className="block rounded-md px-2 py-2 hover:bg-neutral-100">
                All products
              </Link>
            </SheetClose>
          </li>
          {categories.map((category) => (
            <li key={category.slug}>
              <SheetClose asChild>
                <Link href={`/search?category=${category.slug}`} className="block rounded-md px-2 py-2 hover:bg-neutral-100">
                  {category.name}
                </Link>
              </SheetClose>
            </li>
          ))}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
