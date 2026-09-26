import Link from "next/link";
import { Suspense } from "react";
import { PackageSearch, ShieldCheck, Truck } from "lucide-react";
import { CatalogMarquee } from "@/components/home/catalog-marquee";
import { HomeSkeleton } from "@/components/home/home-skeleton";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ProductCard } from "@/components/product-card";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { listCategories, listProductCards } from "@/lib/queries";
import { formatMoney } from "@/lib/money";
import { FREE_SHIPPING_CENTS, STORE_NAME } from "@/lib/store";

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [categories, products] = await Promise.all([listCategories(), listProductCards()]);
  const featured = products.slice(0, 8);
  const suggestions = categories.slice(0, 6);
  const trust = [
    {
      title: "Secure checkout",
      body: "Sign in before you pay. Each order stays tied to your account.",
      icon: ShieldCheck,
    },
    {
      title: "Free shipping",
      body: `Orders from ${formatMoney(FREE_SHIPPING_CENTS)} ship free.`,
      icon: Truck,
    },
    {
      title: "Find your order",
      body: "Look up a recent order from your account with its order number.",
      icon: PackageSearch,
    },
  ];

  return (
    <div className="space-y-12">
      <ScrollReveal>
        <section aria-labelledby="home-hero-heading">
          <p className="text-sm font-medium text-muted-foreground">
            Prices in USD · Free shipping from {formatMoney(FREE_SHIPPING_CENTS)}
          </p>
          <h1 id="home-hero-heading" className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl">
            <TextGenerateEffect words={`Search ${STORE_NAME} for everyday goods.`} />
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Products, brands, and departments for the house, the closet, the desk, and the trip.
          </p>
          {suggestions.length > 0 ? (
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">Popular departments</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {suggestions.map((category) => (
                  <li key={category.slug}>
                    <Link
                      href={`/search?category=${category.slug}`}
                      className="inline-flex cursor-pointer rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      </ScrollReveal>

      {featured.length > 0 ? (
        <section aria-labelledby="home-featured-heading">
          <ScrollReveal>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="home-featured-heading">Featured listings</h2>
              <Link href="/search" className="cursor-pointer text-sm font-semibold text-primary hover:opacity-80">
                See all
              </Link>
            </div>
          </ScrollReveal>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((product, index) => (
              <li key={product.id} className={bentoCell(index, featured.length)}>
                <ScrollReveal className="h-full">
                  <ProductCard product={product} emphasis={index === 0} wide={index === 0 || index === featured.length - 1} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {categories.length > 0 ? (
        <ScrollReveal>
          <section>
            <CatalogMarquee title="Shop by department" label="Departments" layout="grid">
              {categories.map((category) => (
                <CategoryTile key={category.slug} name={category.name} slug={category.slug} />
              ))}
            </CatalogMarquee>
          </section>
        </ScrollReveal>
      ) : null}

      <ScrollReveal>
        <section aria-labelledby="home-trust-heading">
          <h2 id="home-trust-heading">Shop with a few guarantees</h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-3">
            {trust.map((item) => (
              <li key={item.title} className="rounded-lg border border-border bg-card p-4">
                <item.icon className="size-6 text-primary" aria-hidden />
                <h3 className="mt-3">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>

      <ScrollReveal>
        <section aria-labelledby="home-cta-heading">
          <h2 id="home-cta-heading">Search is the fastest way in</h2>
          <p className="mt-2 max-w-xl text-muted-foreground">
            Look up a product, a brand, or a department, then check out when you are signed in.
          </p>
          <Link
            href="/search"
            className="mt-6 inline-flex cursor-pointer items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Browse everything
          </Link>
        </section>
      </ScrollReveal>
    </div>
  );
}

function bentoCell(index: number, count: number) {
  if (index === 0) return "sm:col-span-2 lg:row-span-2";
  if (index === count - 1 && count > 1) return "sm:col-span-2";
  return "";
}

function CategoryTile({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/search?category=${slug}`}
      className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground hover:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="aspect-[5/3] overflow-hidden bg-muted">
        {/* Department art is a fixed crop so every tile stays the same height. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/departments/${slug}.svg`} alt="" className="h-full w-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105" />
      </div>
      <span className="p-3 text-sm font-semibold">{name}</span>
    </Link>
  );
}
