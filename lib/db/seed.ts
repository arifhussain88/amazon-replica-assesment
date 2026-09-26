import { and, count, eq } from "drizzle-orm";
import { existsSync, readFileSync } from "node:fs";
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

const legacySlugRenames = new Map([["percale-sheet-set", "everyday-ceramic-mug"]]);

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

  await renameLegacyProductSlugs(db);
  const productRows = await db.select({ slug: products.slug }).from(products);
  const knownProducts = new Set(productRows.map((row) => row.slug));
  const missingProducts = catalogProducts.filter((product) => !knownProducts.has(product.slug));
  if (missingProducts.length > 0) await insertCatalogProducts(db, missingProducts);
  await repairImageUrls(db);
  await refreshCatalogCopy(db);
}

async function renameLegacyProductSlugs(db: AppDb) {
  for (const [from, to] of legacySlugRenames) {
    const [current] = await db.select({ id: products.id }).from(products).where(eq(products.slug, from)).limit(1);
    if (!current) continue;
    const [conflict] = await db.select({ id: products.id }).from(products).where(eq(products.slug, to)).limit(1);
    if (conflict) continue;
    await db.update(products).set({ slug: to }).where(eq(products.id, current.id));
  }
}

function productImageUrl(slug: string) {
  const product = catalogProducts.find((item) => item.slug === slug);
  if (product?.imageFile) return `/images/products/${product.imageFile}`;
  return `/products/${slug}.${svgProductSlugs.has(slug) ? "svg" : "webp"}`;
}

async function repairImageUrls(db: AppDb) {
  for (const slug of svgProductSlugs) {
    await db
      .update(productImages)
      .set({ url: productImageUrl(slug) })
      .where(eq(productImages.id, `img-${slug}`));
  }
}

async function refreshCatalogCopy(db: AppDb) {
  for (const category of catalogCategories) {
    await db
      .update(categories)
      .set({ name: category.name, description: category.description })
      .where(eq(categories.slug, category.slug));
  }

  for (const product of catalogProducts) {
    if (!product.imageFile) continue;
    const [row] = await db.select({ id: products.id }).from(products).where(eq(products.slug, product.slug)).limit(1);
    if (!row) continue;
    await db
      .update(products)
      .set({
        name: product.name,
        brand: product.brand,
        priceCents: lowestPriceCents(product),
        compareAtPriceCents: product.compareAtPriceCents ?? null,
        shortDescription: product.shortDescription,
        description: product.description,
        features: product.features,
        specifications: product.specifications,
        stock: product.variants?.length ? 0 : product.stock,
      })
      .where(eq(products.id, row.id));

    await db
      .update(productImages)
      .set({ url: productImageUrl(product.slug), alt: product.name })
      .where(and(eq(productImages.productId, row.id), eq(productImages.sortOrder, 0)));

    const existingVariants = await db
      .select({ id: productVariants.id, sortOrder: productVariants.sortOrder })
      .from(productVariants)
      .where(eq(productVariants.productId, row.id));
    const desired = product.variants ?? [];
    const ordered = [...existingVariants].sort((left, right) => left.sortOrder - right.sortOrder);
    if (ordered.length === desired.length) {
      for (let index = 0; index < desired.length; index += 1) {
        const variant = desired[index];
        await db
          .update(productVariants)
          .set({
            optionName: variant.optionName,
            optionValue: variant.optionValue,
            stock: variant.stock,
            priceCents: variant.priceCents ?? null,
            sortOrder: index,
          })
          .where(eq(productVariants.id, ordered[index].id));
      }
    }

    const existingReviews = await db
      .select({ id: reviews.id, createdAt: reviews.createdAt })
      .from(reviews)
      .where(eq(reviews.productId, row.id));
    const orderedReviews = [...existingReviews].sort(
      (left, right) => left.createdAt.getTime() - right.createdAt.getTime() || left.id.localeCompare(right.id),
    );
    if (orderedReviews.length === product.reviews.length) {
      for (let index = 0; index < product.reviews.length; index += 1) {
        const review = product.reviews[index];
        await db
          .update(reviews)
          .set({
            author: review.author,
            rating: review.rating,
            title: review.title,
            body: review.body,
          })
          .where(eq(reviews.id, orderedReviews[index].id));
      }
    }
  }
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
      url: productImageUrl(product.slug),
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

const entry = process.argv[1]?.replaceAll("\\", "/");
if (entry?.endsWith("lib/db/seed.ts")) {
  void syncFromCli();
}

function loadLocalEnv() {
  if (!existsSync(".env.local")) return;
  const text = readFileSync(".env.local", "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;
    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

function databaseHost(databaseUrl: string) {
  try {
    return new URL(databaseUrl).hostname;
  } catch {
    return "";
  }
}

async function syncFromCli() {
  loadLocalEnv();
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL is unset. Set it in .env.local, then run npm run db:seed.");
    process.exitCode = 1;
    return;
  }

  const host = databaseHost(databaseUrl);
  if (host.includes("ep-wild-flower-b4j742e1")) {
    console.error("Refusing to seed production.");
    process.exitCode = 1;
    return;
  }
  console.log(`Seeding host ${host}, branch ${process.env.NEON_BRANCH ?? "unset"}.`);

  const { Pool, neonConfig } = await import("@neondatabase/serverless");
  const ws = (await import("ws")).default;
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: databaseUrl });
  const { drizzle } = await import("drizzle-orm/neon-serverless");
  const db = drizzle({ client: pool, schema }) as unknown as AppDb;
  try {
    await syncCatalog(db);
    console.log("Catalog synced.");
  } finally {
    await pool.end();
  }
}

