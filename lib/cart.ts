import "server-only";

import { and, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { getDb } from "@/lib/db";
import { cartItems, carts, productImages, productVariants, products } from "@/lib/db/schema";
import type { CartLine } from "@/lib/types";

export const CART_COOKIE = "nl_cart";
export const ORDER_COOKIE = "nl_recent_order";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30,
};

export async function readCartId() {
  const jar = await cookies();
  return jar.get(CART_COOKIE)?.value ?? null;
}

export async function readCart() {
  const cartId = await readCartId();
  if (!cartId) return { lines: [] as CartLine[], subtotalCents: 0 };
  const db = await getDb();
  const rows = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      variantId: cartItems.variantId,
      variantLabel: cartItems.variantLabel,
      productId: products.id,
      name: products.name,
      slug: products.slug,
      brand: products.brand,
      priceCents: products.priceCents,
      productStock: products.stock,
      imageUrl: productImages.url,
      imageAlt: productImages.alt,
      variantPrice: productVariants.priceCents,
      variantStock: productVariants.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .leftJoin(productImages, and(eq(productImages.productId, products.id), eq(productImages.sortOrder, 0)))
    .where(eq(cartItems.cartId, cartId));

  const lines: CartLine[] = rows.map((row) => ({
    id: row.id,
    productId: row.productId,
    variantId: row.variantId,
    quantity: row.quantity,
    name: row.name,
    slug: row.slug,
    brand: row.brand,
    imageUrl: row.imageUrl ?? "",
    imageAlt: row.imageAlt ?? row.name,
    variantLabel: row.variantLabel,
    unitPriceCents: row.variantPrice ?? row.priceCents,
    stock: row.variantId ? (row.variantStock ?? 0) : row.productStock,
  }));
  const subtotalCents = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
  return { lines, subtotalCents };
}

export async function cartCount() {
  const { lines } = await readCart();
  return lines.reduce((sum, line) => sum + line.quantity, 0);
}

export async function ensureCart() {
  const db = await getDb();
  const jar = await cookies();
  const current = jar.get(CART_COOKIE)?.value;
  if (current) {
    const existing = await db.select({ id: carts.id }).from(carts).where(eq(carts.id, current)).limit(1);
    if (existing.length > 0) return current;
  }
  const id = crypto.randomUUID();
  await db.insert(carts).values({ id, createdAt: new Date() });
  jar.set(CART_COOKIE, id, cookieOptions);
  return id;
}

export async function rememberOrder(orderNumber: string) {
  const jar = await cookies();
  jar.set(ORDER_COOKIE, orderNumber, cookieOptions);
}

export async function recentOrderNumber() {
  const jar = await cookies();
  return jar.get(ORDER_COOKIE)?.value ?? null;
}
