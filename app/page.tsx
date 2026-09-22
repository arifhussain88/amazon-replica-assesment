import Link from "next/link";
import { ProductCard } from "@/components/product-card";
import { listCategories, listProductCards } from "@/lib/queries";
import { FREE_SHIPPING_CENTS, STORE_NAME } from "@/lib/store";
import { formatMoney } from "@/lib/money";

const tileColors = ["#f7d9c4", "#d7e4f5", "#efe3c2", "#dcead8", "#f3d5df", "#e6e0f4", "#f6e7c1", "#d5ebe8", "#f0ddd2"];

export default async function HomePage() {
  const [categories, products] = await Promise.all([listCategories(), listProductCards()]);
  return (
    <div className="space-y-8">
      <section className="rounded-md bg-white p-5">
        <p className="text-sm text-neutral-600">Guest checkout · Prices in USD · Free shipping from {formatMoney(FREE_SHIPPING_CENTS)}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{STORE_NAME}</h1>
        <p className="mt-2 max-w-2xl text-neutral-700">Everyday goods across the house, the closet, the desk, and the trip. No account required.</p>
      </section>
      <section>
        <h2 className="mb-3 text-xl font-semibold">Shop by department</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((category, index) => (
            <Link
              key={category.slug}
              href={`/search?category=${category.slug}`}
              className="flex h-36 flex-col justify-between rounded-md p-4"
              style={{ backgroundColor: tileColors[index % tileColors.length] }}
            >
              <span className="text-lg font-semibold leading-tight">{category.name}</span>
              <span className="text-sm">Shop now</span>
            </Link>
          ))}
        </div>
      </section>
      {categories.map((category) => {
        const items = products.filter((product) => product.categorySlug === category.slug);
        if (items.length === 0) return null;
        return (
          <section key={category.slug}>
            <div className="mb-3 flex items-baseline justify-between gap-3">
              <h2 className="text-xl font-semibold">{category.name}</h2>
              <Link href={`/search?category=${category.slug}`} className="text-sm text-[#1a5276]">
                See all
              </Link>
            </div>
            <ul className="flex gap-3 overflow-x-auto pb-2">
              {items.map((product) => (
                <li key={product.id} className="w-56 shrink-0">
                  <ProductCard product={product} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
