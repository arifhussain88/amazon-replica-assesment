import Link from "next/link";
import { Suspense } from "react";
import { CartDrawer } from "@/components/cart-drawer";
import { DepartmentMenu } from "@/components/department-menu";
import { SiteSearch } from "@/components/site-search";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { listCategories } from "@/lib/queries";
import { STORE_NAME } from "@/lib/store";

export async function SiteHeader() {
  const [{ lines, subtotalCents }, categories, user] = await Promise.all([readCart(), listCategories(), getCurrentUser()]);
  const count = lines.reduce((sum, line) => sum + line.quantity, 0);
  const firstName = user?.name.split(" ")[0];

  return (
    <header className="text-white">
      <div className="bg-[#131921]">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-3 py-2 lg:gap-4 lg:px-6">
          <Link href="/" className="shrink-0 text-xl font-semibold tracking-tight">
            {STORE_NAME}
          </Link>
          <p className="hidden text-xs leading-tight sm:block">
            <span className="block text-neutral-300">Deliver to</span>
            <span className="font-semibold">United States</span>
          </p>
          <Suspense fallback={<div className="h-10 min-w-0 flex-1 rounded-md bg-white/90" />}>
            <SiteSearch />
          </Suspense>
          <Link href={user ? "/orders" : "/account?next=/orders"} className="hidden text-sm leading-tight sm:block">
            <span className="block text-xs text-neutral-300">{user ? `Hello, ${firstName}` : "Hello, sign in"}</span>
            <span className="font-semibold">Account & Orders</span>
          </Link>
          <CartDrawer lines={lines} subtotalCents={subtotalCents} count={count} />
        </div>
      </div>
      <div className="bg-[#232f3e]">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-3 py-2 lg:px-6">
          <DepartmentMenu categories={categories} />
          <Link href="/orders" className="shrink-0 px-2 text-sm sm:hidden">
            Orders
          </Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/search?category=${category.slug}`} className="shrink-0 px-2 text-sm hover:outline hover:outline-white">
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
