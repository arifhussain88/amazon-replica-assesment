import Link from "next/link";
import { CardAddButton } from "@/components/card-add-button";
import { CardMedia } from "@/components/card-media";
import { PriceTag } from "@/components/price-tag";
import { QuickView } from "@/components/quick-view";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import type { ProductCard as ProductCardData } from "@/lib/types";

export function ProductCard({
  product,
  emphasis = false,
  wide = false,
}: {
  product: ProductCardData;
  emphasis?: boolean;
  wide?: boolean;
}) {
  const images = product.images.length > 0 ? product.images : [{ url: product.imageUrl, alt: product.imageAlt }];

  return (
    <article className="flex h-full flex-col rounded-lg border border-border bg-card p-3">
      <Link href={`/p/${product.slug}`} className={cn("block overflow-hidden rounded-md", emphasis && "min-h-48 flex-1")}>
        <CardMedia images={images} fill={emphasis} />
      </Link>
      <p className="mt-3 text-xs text-muted-foreground">{product.brand}</p>
      <Link href={`/p/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 cursor-pointer text-sm leading-5 text-foreground hover:text-primary">
        {product.name}
      </Link>
      <div className="mt-1">
        <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
      </div>
      <div className="mt-1">
        <PriceTag priceCents={product.priceCents} compareAtPriceCents={product.compareAtPriceCents} variants={product.variants} />
      </div>
      <div className={cn("mt-3 w-full space-y-2", wide && "sm:max-w-64")}>
        <CardAddButton productId={product.id} stock={product.stock} variants={product.variants} />
        <QuickView product={product} />
      </div>
    </article>
  );
}
