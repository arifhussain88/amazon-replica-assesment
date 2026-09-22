import "server-only";

import { and, asc, desc, eq, gte, ilike, inArray, lte, or, sql } from "drizzle-orm";
import { getDb } from "@/lib/db";
import {
  categories,
  orderItems,
  orders,
  productImages,
  productVariants,
  products,
  reviews,
} from "@/lib/db/schema";
import type { OrderRecord, ProductCard, ProductDetail, SearchFilters, VariantChoice } from "@/lib/types";

export async function listCategories() {
  const db = await getDb();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function listProductCards(filters?: SearchFilters) {
  const db = await getDb();
  const conditions = [];
  if (filters?.q) {
    const pattern = `%${filters.q}%`;
    conditions.push(
      or(
        ilike(products.name, pattern),
        ilike(products.brand, pattern),
        ilike(products.shortDescription, pattern),
        ilike(categories.name, pattern),
      ),
    );
  }
  if (filters?.category) conditions.push(eq(categories.slug, filters.category));
  if (filters?.brands.length) conditions.push(inArray(products.brand, filters.brands));
  if (filters?.minDollars != null) conditions.push(gte(products.priceCents, Math.round(filters.minDollars * 100)));
  if (filters?.maxDollars != null) conditions.push(lte(products.priceCents, Math.round(filters.maxDollars * 100)));
  if (filters?.rating) conditions.push(gte(products.ratingTimes10, filters.rating * 10));

  const order =
    filters?.sort === "price-asc"
      ? [asc(products.priceCents)]
      : filters?.sort === "price-desc"
        ? [desc(products.priceCents)]
        : filters?.sort === "rating"
          ? [desc(products.ratingTimes10), asc(products.name)]
          : filters?.sort === "newest"
            ? [desc(products.createdAt)]
            : [desc(products.ratingTimes10), asc(products.name)];

  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      categorySlug: categories.slug,
      categoryName: categories.name,
      priceCents: products.priceCents,
      compareAtPriceCents: products.compareAtPriceCents,
      ratingTimes10: products.ratingTimes10,
      ratingCount: products.ratingCount,
      shortDescription: products.shortDescription,
      features: products.features,
      stock: products.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(...order);

  return hydrateCards(rows);
}

export async function listBrands(category?: string) {
  const db = await getDb();
  const rows = await db
    .selectDistinct({ brand: products.brand })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(category ? eq(categories.slug, category) : undefined)
    .orderBy(asc(products.brand));
  return rows.map((row) => row.brand);
}

export async function getProduct(slug: string): Promise<ProductDetail | null> {
  const db = await getDb();
  const rows = await db
    .select({
      id: products.id,
      slug: products.slug,
      name: products.name,
      brand: products.brand,
      categorySlug: categories.slug,
      categoryName: categories.name,
      priceCents: products.priceCents,
      compareAtPriceCents: products.compareAtPriceCents,
      ratingTimes10: products.ratingTimes10,
      ratingCount: products.ratingCount,
      shortDescription: products.shortDescription,
      description: products.description,
      features: products.features,
      specifications: products.specifications,
      stock: products.stock,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  const product = rows[0];
  if (!product) return null;
  const [card] = await hydrateCards([product]);
  const reviewRows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.productId, product.id))
    .orderBy(desc(reviews.createdAt));

  return {
    ...card,
    description: product.description,
    specifications: product.specifications,
    reviews: reviewRows.map((review) => ({
      id: review.id,
      author: review.author,
      rating: review.rating,
      title: review.title,
      body: review.body,
      createdAt: review.createdAt.toISOString(),
    })),
  };
}

export async function getOrderForViewer(orderNumber: string, email?: string | null) {
  const db = await getDb();
  const match = email
    ? and(eq(orders.orderNumber, orderNumber), sql`lower(${orders.email}) = ${email.toLowerCase()}`)
    : eq(orders.orderNumber, orderNumber);
  const rows = await db.select().from(orders).where(match).limit(1);
  const order = rows[0];
  if (!order) return null;
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, order.id));
  const record: OrderRecord = {
    orderNumber: order.orderNumber,
    email: order.email,
    fullName: order.fullName,
    line1: order.line1,
    city: order.city,
    region: order.region,
    postalCode: order.postalCode,
    country: order.country,
    subtotalCents: order.subtotalCents,
    shippingCents: order.shippingCents,
    totalCents: order.totalCents,
    status: order.status,
    createdAt: order.createdAt.toISOString(),
    items: items.map((item) => ({
      id: item.id,
      name: item.name,
      variantLabel: item.variantLabel,
      unitPriceCents: item.unitPriceCents,
      quantity: item.quantity,
    })),
  };
  return record;
}

async function hydrateCards(
  rows: Array<{
    id: string;
    slug: string;
    name: string;
    brand: string;
    categorySlug: string;
    categoryName: string;
    priceCents: number;
    compareAtPriceCents: number | null;
    ratingTimes10: number;
    ratingCount: number;
    shortDescription: string;
    features: string[];
    stock: number;
  }>,
): Promise<ProductCard[]> {
  if (rows.length === 0) return [];
  const db = await getDb();
  const ids = rows.map((row) => row.id);
  const images = await db
    .select()
    .from(productImages)
    .where(inArray(productImages.productId, ids))
    .orderBy(asc(productImages.sortOrder));
  const variantRows = await db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, ids))
    .orderBy(asc(productVariants.sortOrder));

  return rows.map((row) => {
    const productImagesForRow = images.filter((image) => image.productId === row.id);
    const variants: VariantChoice[] = variantRows
      .filter((variant) => variant.productId === row.id)
      .map((variant) => ({
        id: variant.id,
        optionName: variant.optionName,
        optionValue: variant.optionValue,
        stock: variant.stock,
        priceCents: variant.priceCents,
        sortOrder: variant.sortOrder,
      }));
    const primary = productImagesForRow[0];
    return {
      ...row,
      imageUrl: primary?.url ?? "",
      imageAlt: primary?.alt ?? row.name,
      images: productImagesForRow.map((image) => ({ url: image.url, alt: image.alt })),
      variants,
    };
  });
}
