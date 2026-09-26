import Link from "next/link";
import { Suspense } from "react";
import {
  BookOpen,
  CookingPot,
  Dumbbell,
  Hammer,
  Luggage,
  PackageSearch,
  Puzzle,
  ShieldCheck,
  Shirt,
  Sparkles,
  Speaker,
  Tag,
  Truck,
  type LucideIcon,
} from "lucide-react";
import { HomeSkeleton } from "@/components/home/home-skeleton";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { formatMoney } from "@/lib/money";
import { listCategories, listProductCards } from "@/lib/queries";
import { FREE_SHIPPING_CENTS, STORE_NAME } from "@/lib/store";
import type { ProductCard } from "@/lib/types";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  electronics: Speaker,
  "home-kitchen": CookingPot,
  clothing: Shirt,
  beauty: Sparkles,
  sports: Dumbbell,
  "books-stationery": BookOpen,
  toys: Puzzle,
  travel: Luggage,
  tools: Hammer,
};

const heroSlug = "merino-crewneck";
const bentoSlugs = ["carry-on-spinner", "harbor-compact-speaker", "everyday-ceramic-mug", "studio-yoga-mat"];

export default function HomePage() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const [categories, products] = await Promise.all([listCategories(), listProductCards()]);
  const photographed = products.filter((product) => product.imageUrl.startsWith("/images/products/"));
  const hero = photographed.find((product) => product.slug === heroSlug) ?? photographed[0];
  const tiles = pickBento(photographed, hero?.slug);

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
      <section aria-labelledby="home-hero-heading" className="-mx-3 bg-primary text-primary-foreground lg:-mx-6">
        <div className="grid items-center gap-8 px-3 py-12 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-16">
          <div>
            <p className="text-sm font-semibold tracking-wide text-accent">Everyday goods</p>
            <h1 id="home-hero-heading" className="mt-3 max-w-xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              Goods for the house, the closet, and the trip.
            </h1>
            <p className="mt-4 max-w-lg text-base leading-7 text-primary-foreground/90">
              {STORE_NAME} is a shop of real objects, priced in US dollars. Free shipping starts at{" "}
              {formatMoney(FREE_SHIPPING_CENTS)}.
            </p>
            <Link
              href="/search"
              className="mt-8 inline-flex cursor-pointer items-center justify-center rounded-lg bg-accent px-6 py-3 text-base font-semibold text-accent-foreground hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            >
              Browse everything
            </Link>
          </div>
          {hero ? (
            <Link
              href={`/p/${hero.slug}`}
              aria-label={hero.name}
              className="group block overflow-hidden rounded-lg bg-image focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              {/* Studio and lifestyle photos are local files with mixed crops. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={hero.imageUrl}
                alt={hero.imageAlt}
                className="aspect-[4/5] w-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105 sm:aspect-[5/4] lg:aspect-[5/4] lg:max-h-[32rem]"
              />
            </Link>
          ) : null}
        </div>
      </section>

      {categories.length > 0 ? (
        <ScrollReveal>
          <nav aria-label="Departments">
            <h2 className="mb-4">Shop by department</h2>
            <ul className="flex gap-3 overflow-x-auto pb-1 lg:grid lg:grid-cols-9 lg:overflow-visible">
              {categories.map((category) => {
                const Icon = categoryIcons[category.slug] ?? Tag;
                return (
                  <li key={category.slug} className="w-32 shrink-0 lg:w-auto">
                    <Link
                      href={`/search?category=${category.slug}`}
                      className="flex h-full cursor-pointer flex-col items-center gap-2 rounded-lg border border-border bg-card px-2 py-4 text-center text-xs font-semibold leading-tight text-foreground hover:border-accent hover:bg-accent hover:text-accent-foreground focus-visible:border-accent focus-visible:bg-accent focus-visible:text-accent-foreground focus-visible:outline-none active:border-accent active:bg-accent active:text-accent-foreground"
                    >
                      <Icon className="size-6 shrink-0" aria-hidden />
                      {category.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </ScrollReveal>
      ) : null}

      {tiles.length > 0 ? (
        <section aria-labelledby="home-featured-heading">
          <ScrollReveal>
            <div className="mb-4 flex items-baseline justify-between gap-3">
              <h2 id="home-featured-heading">Featured</h2>
              <Link href="/search" className="cursor-pointer text-sm font-semibold text-primary hover:opacity-80">
                See all
              </Link>
            </div>
          </ScrollReveal>
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {tiles.map((product, index) => (
              <li
                key={product.id}
                className={cn(
                  index === 0 && "sm:col-span-2 lg:row-span-2",
                  index === tiles.length - 1 && tiles.length > 2 && "sm:col-span-2 lg:col-span-2",
                )}
              >
                <ScrollReveal className="h-full">
                  <FeaturedTile product={product} large={index === 0} />
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <ScrollReveal>
        <section aria-labelledby="home-trust-heading">
          <h2 id="home-trust-heading">Shop with a few guarantees</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {trust.map((item) => (
              <li key={item.title} className="rounded-lg border border-border bg-card p-5">
                <span className="inline-flex size-11 items-center justify-center rounded-lg border border-accent bg-accent text-accent-foreground">
                  <item.icon className="size-5" aria-hidden />
                </span>
                <h3 className="mt-4">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{item.body}</p>
              </li>
            ))}
          </ul>
        </section>
      </ScrollReveal>
    </div>
  );
}

function pickBento(products: ProductCard[], heroSlugUsed?: string) {
  const chosen = bentoSlugs
    .map((slug) => products.find((product) => product.slug === slug))
    .filter((product): product is ProductCard => Boolean(product) && product.slug !== heroSlugUsed);
  const used = new Set(chosen.map((product) => product.slug));
  if (heroSlugUsed) used.add(heroSlugUsed);
  const fillers = products.filter((product) => !used.has(product.slug));
  return [...chosen, ...fillers].slice(0, 4);
}

function FeaturedTile({ product, large }: { product: ProductCard; large: boolean }) {
  return (
    <Link
      href={`/p/${product.slug}`}
      className={cn(
        "group relative flex h-full overflow-hidden rounded-lg bg-image focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        large ? "min-h-[28rem]" : "min-h-56",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={product.imageUrl}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-200 ease-out motion-safe:group-hover:scale-105"
      />
      <span className="relative mt-auto w-full bg-primary px-4 py-3 text-primary-foreground">
        <span className="block text-xs font-semibold text-accent">{product.brand}</span>
        <span className={cn("mt-1 block font-semibold", large ? "text-xl" : "text-sm")}>{product.name}</span>
        <span className="mt-1 block text-sm">{formatMoney(product.priceCents)}</span>
      </span>
    </Link>
  );
}
