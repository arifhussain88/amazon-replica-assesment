import Link from "next/link";
import { PriceTag } from "@/components/price-tag";
import { ProductImage } from "@/components/product-image";
import { QuickView } from "@/components/quick-view";
import { StarRating } from "@/components/star-rating";
import type { ProductCard as ProductCardData } from "@/lib/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="flex h-full flex-col rounded-md border border-[#e3e6e6] bg-white p-3">
      <Link href={`/p/${product.slug}`} className="block">
        <ProductImage src={product.imageUrl} alt={product.imageAlt} />
      </Link>
      <p className="mt-3 text-xs text-neutral-500">{product.brand}</p>
      <Link href={`/p/${product.slug}`} className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 hover:text-[#1a5276]">
        {product.name}
      </Link>
      <div className="mt-1">
        <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
      </div>
      <div className="mt-1">
        <PriceTag priceCents={product.priceCents} compareAtPriceCents={product.compareAtPriceCents} variants={product.variants} />
      </div>
      <div className="mt-3">
        <QuickView product={product} />
      </div>
    </article>
  );
}
