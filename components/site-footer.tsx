import Link from "next/link";
import { listCategories } from "@/lib/queries";
import { STORE_NAME } from "@/lib/store";

export async function SiteFooter() {
  const categories = await listCategories();
  return (
    <footer className="mt-12 bg-primary text-sm text-primary-foreground/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:grid-cols-3">
        <div>
          <p className="font-semibold text-primary-foreground">Shop</p>
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
          <p className="font-semibold text-primary-foreground">Your orders</p>
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
          <p className="font-semibold text-primary-foreground">{STORE_NAME}</p>
          <p className="mt-3 leading-6 text-primary-foreground/80">
            Everyday goods with a signed-in checkout. Prices are in US dollars. Payments are checked and not charged.
          </p>
          <p className="mt-4 text-primary-foreground/70">English · USD · United States</p>
        </div>
      </div>
      <p className="border-t border-primary-foreground/15 py-4 text-center text-xs text-primary-foreground/70">© {new Date().getFullYear()} {STORE_NAME}</p>
    </footer>
  );
}
