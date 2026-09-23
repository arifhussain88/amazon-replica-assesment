import { count } from "drizzle-orm";
import type { PgliteDatabase } from "drizzle-orm/pglite";
import {
  catalogCategories,
  catalogProducts,
  lowestPriceCents,
  ratingFromReviews,
  slugifyOption,
  type CatalogProduct,
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

const svgProductSlugs = new Set([
  "usb-c-hub",
  "cotton-kitchen-towels",
  "merino-beanie",
  "unscented-lip-balm",
  "shea-hand-cream",
  "ankle-weights",
  "weekly-planner",
  "wooden-animal-puzzle",
  "soft-play-balls",
  "toiletry-pouch",
  "tape-measure",
  "claw-hammer",
]);

export async function seedIfEmpty(db: AppDb) {
  const existing = await db.select({ value: count() }).from(categories);
  if (Number(existing[0]?.value ?? 0) > 0) return;
  await insertCategories(db, catalogCategories.map((category) => category.slug));
  await insertCatalogProducts(db, catalogProducts);
}

export async function syncCatalog(db: AppDb) {
  await seedIfEmpty(db);
  const categoryRows = await db.select({ slug: categories.slug }).from(categories);
  const knownCategories = new Set(categoryRows.map((row) => row.slug));
  const missingCategories = catalogCategories
    .filter((category) => !knownCategories.has(category.slug))
    .map((category) => category.slug);
  if (missingCategories.length > 0) await insertCategories(db, missingCategories);

  const productRows = await db.select({ slug: products.slug }).from(products);
  const knownProducts = new Set(productRows.map((row) => row.slug));
  const missingProducts = catalogProducts.filter((product) => !knownProducts.has(product.slug));
  if (missingProducts.length > 0) await insertCatalogProducts(db, missingProducts);
}

async function insertCategories(db: AppDb, slugs: string[]) {
  const rows = slugs.flatMap((slug) => {
    const index = catalogCategories.findIndex((category) => category.slug === slug);
    const category = catalogCategories[index];
    if (!category) return [];
    return [
      {
        id: `cat-${category.slug}`,
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: index,
      },
    ];
  });
  if (rows.length > 0) await db.insert(categories).values(rows);
}

async function insertCatalogProducts(db: AppDb, items: CatalogProduct[]) {
  if (items.length === 0) return;
  await db.insert(products).values(
    items.map((product) => {
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

  const variantRows = items.flatMap((product) =>
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
  if (variantRows.length > 0) await db.insert(productVariants).values(variantRows);

  await db.insert(productImages).values(
    items.map((product) => ({
      id: `img-${product.slug}`,
      productId: `prod-${product.slug}`,
      url: `/products/${product.slug}.${svgProductSlugs.has(product.slug) ? "svg" : "webp"}`,
      alt: product.name,
      sortOrder: 0,
    })),
  );

  await db.insert(reviews).values(
    items.flatMap((product) =>
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

