import Link from "next/link";
import { listCategories } from "@/lib/queries";
import { STORE_NAME } from "@/lib/store";

export async function SiteFooter() {
  const categories = await listCategories();
  return (
    <footer className="mt-12 bg-[#131921] text-sm text-neutral-200">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-white">Shop</p>
          <ul className="mt-3 space-y-2">
            {categories.map((category) => (
              <li key={category.slug}>
                <Link href={`/search?category=${category.slug}`} className="hover:underline">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">Your orders</p>
          <ul className="mt-3 space-y-2">
            <li>
              <Link href="/cart" className="hover:underline">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/orders" className="hover:underline">
                Order history
              </Link>
            </li>
            <li>
              <Link href="/checkout" className="hover:underline">
                Checkout
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="font-semibold text-white">{STORE_NAME}</p>
          <p className="mt-3 leading-6 text-neutral-300">
            Everyday goods with a signed-in checkout. Prices are in US dollars. Payments are checked and not charged.
          </p>
          <p className="mt-4 text-neutral-400">English · USD · United States</p>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-neutral-400">© {new Date().getFullYear()} {STORE_NAME}</p>
    </footer>
  );
}
