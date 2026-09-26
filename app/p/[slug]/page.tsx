import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BuyBox } from "@/components/buy-box";
import { Gallery } from "@/components/gallery";
import { StarRating } from "@/components/star-rating";
import { getProduct } from "@/lib/queries";
import { cardSurface } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  return { title: product?.name ?? "Product" };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const buckets = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: product.reviews.filter((review) => review.rating === star).length,
  }));

  return (
    <div className="pb-[45vh] lg:pb-0">
      <p className="text-sm text-muted-foreground">
        <Link href={`/search?category=${product.categorySlug}`} className="text-foreground hover:text-primary">
          {product.categoryName}
        </Link>
      </p>
      <div className="mt-4 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
          <Gallery images={product.images} name={product.name} />
          <div>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
            <h1 className="mt-1 font-sans text-2xl font-semibold leading-snug text-foreground">{product.name}</h1>
            <div className="mt-2">
              <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 text-foreground">
              {product.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
        </div>
        <BuyBox
          imageUrl={product.imageUrl}
          imageAlt={product.imageAlt}
          productId={product.id}
          priceCents={product.priceCents}
          compareAtPriceCents={product.compareAtPriceCents}
          stock={product.stock}
          variants={product.variants}
        />
        <section className={cn(cardSurface, "grid gap-8 p-5 lg:col-start-1 lg:grid-cols-2")}>
        <div>
          <h2 className="text-xl font-semibold">About this item</h2>
          <p className="mt-3 text-sm leading-7">{product.description}</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">Specifications</h2>
          <dl className="mt-3 divide-y divide-border text-sm">
            {product.specifications.map((spec) => (
              <div key={spec.label} className="grid grid-cols-2 gap-3 py-2">
                <dt className="text-muted-foreground">{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <section className={cn(cardSurface, "p-5 lg:col-start-1")}>
        <h2 className="text-xl font-semibold">Customer reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">These reviews are seeded demo data for this store.</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
          <div>
            <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
            <ul className="mt-3 space-y-1 text-sm">
              {buckets.map((bucket) => (
                <li key={bucket.star} className="grid grid-cols-[3rem_1fr_1.5rem] items-center gap-2">
                  <span>{bucket.star} star</span>
                  <span className="h-2 overflow-hidden rounded-full bg-image">
                    <span
                      className="block h-full bg-accent"
                      style={{ width: `${product.ratingCount ? (bucket.count / product.ratingCount) * 100 : 0}%` }}
                    />
                  </span>
                  <span>{bucket.count}</span>
                </li>
              ))}
            </ul>
          </div>
          <ul className="space-y-5">
            {product.reviews.map((review) => (
              <li key={review.id} className="border-b border-border pb-4">
                <StarRating ratingTimes10={review.rating * 10} />
                <p className="mt-1 font-semibold">{review.title}</p>
                <p className="text-xs text-muted-foreground">
                  {review.author} · {new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(review.createdAt))} · Demo review
                </p>
                <p className="mt-2 text-sm leading-6">{review.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      </div>
    </div>
  );
}
