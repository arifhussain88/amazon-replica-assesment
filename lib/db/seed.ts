import { count } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import {
  catalogCategories,
  catalogProducts,
  lowestPriceCents,
  ratingFromReviews,
  slugifyOption,
} from "@/lib/catalog";
import * as schema from "@/lib/db/schema";
import {
  categories,
  productImages,
  productVariants,
  products,
  reviews,
} from "@/lib/db/schema";

type AppDb = PgliteDatabase<typeof schema>;

export async function seedIfEmpty(db: AppDb) {
  const existing = await db.select({ value: count() }).from(categories);
  if (Number(existing[0]?.value ?? 0) > 0) return;

  await db.insert(categories).values(
    catalogCategories.map((category, index) => ({
      id: `cat-${category.slug}`,
      name: category.name,
      slug: category.slug,
      description: category.description,
      sortOrder: index,
    })),
  );

  await db.insert(products).values(
    catalogProducts.map((product) => {
      const rating = ratingFromReviews(product.reviews);
      return {
        id: `prod-${product.slug}`,
        categoryId: `cat-${product.category}`,
        name: product.name,
        slug: product.slug,
        brand: product.brand,
        priceCents: lowestPriceCents(product),
        compareAtPriceCents: product.compareAtPriceCents ?? null,
        shortDescription: product.shortDescription,
        description: product.description,
        features: product.features,
        specifications: product.specifications,
        stock: product.variants?.length ? 0 : product.stock,
        ratingTimes10: rating.ratingTimes10,
        ratingCount: rating.ratingCount,
        createdAt: new Date(product.createdAt),
      };
    }),
  );

  const variantRows = catalogProducts.flatMap((product) =>
    (product.variants ?? []).map((variant, index) => ({
      id: `var-${product.slug}-${slugifyOption(variant.optionValue)}`,
      productId: `prod-${product.slug}`,
      optionName: variant.optionName,
      optionValue: variant.optionValue,
      stock: variant.stock,
      priceCents: variant.priceCents ?? null,
      sortOrder: index,
    })),
  );
  if (variantRows.length > 0) {
    await db.insert(productVariants).values(variantRows);
  }

  await db.insert(productImages).values(
    catalogProducts.map((product) => ({
      id: `img-${product.slug}`,
      productId: `prod-${product.slug}`,
      url: `/products/${product.slug}.webp`,
      alt: product.name,
      sortOrder: 0,
    })),
  );

  await db.insert(reviews).values(
    catalogProducts.flatMap((product) =>
      product.reviews.map((review, index) => ({
        id: `rev-${product.slug}-${index + 1}`,
        productId: `prod-${product.slug}`,
        author: review.author,
        rating: review.rating,
        title: review.title,
        body: review.body,
        createdAt: new Date(review.createdAt),
      })),
    ),
  );
}

