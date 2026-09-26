import "server-only";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { variantLabel } from "@/lib/catalog";
import { getDb } from "@/lib/db";
import { cartItems, carts, productImages, productVariants, products } from "@/lib/db/schema";
import type { CartLine } from "@/lib/types";

export type CartMutationResult = {
  ok?: boolean;
  error?: string;
};

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

export async function addCartItem(input: {
  productId: string;
  variantId: string;
  quantity: number;
}): Promise<CartMutationResult> {
  const { productId, variantId, quantity } = input;
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return { error: "Choose a quantity between 1 and 20." };
  }

  const db = await getDb();
  const productRows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const product = productRows[0];
  if (!product) return { error: "That product is no longer available." };

  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, productId));

  let label: string | null = null;
  let stock = product.stock;
  if (variants.length > 0) {
    const variant = variants.find((item) => item.id === variantId);
    if (!variant) return { error: `Choose a ${variants[0]?.optionName.toLowerCase() ?? "option"}.` };
    label = variantLabel(variant.optionName, variant.optionValue);
    stock = variant.stock;
  }

  const cartId = await ensureCart();
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.cartId, cartId),
        eq(cartItems.productId, productId),
        variantId ? eq(cartItems.variantId, variantId) : isNull(cartItems.variantId),
      ),
    )
    .limit(1);

  const nextQuantity = (existing[0]?.quantity ?? 0) + quantity;
  if (nextQuantity > stock) {
    return { error: stock > 0 ? `Only ${stock} left in stock.` : "That option is out of stock." };
  }

  if (existing[0]) {
    await db.update(cartItems).set({ quantity: nextQuantity }).where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({
      id: crypto.randomUUID(),
      cartId,
      productId,
      variantId: variantId || null,
      quantity,
      variantLabel: label,
    });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}

export async function updateCartItemById(itemId: string, quantity: number) {
  const db = await getDb();
  if (!Number.isInteger(quantity) || quantity < 1) {
    await db.delete(cartItems).where(eq(cartItems.id, itemId));
  } else {
    const rows = await db
      .select({
        productStock: products.stock,
        variantStock: productVariants.stock,
        variantId: cartItems.variantId,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .where(eq(cartItems.id, itemId))
      .limit(1);
    const row = rows[0];
    if (!row) return;
    const stock = row.variantId ? (row.variantStock ?? 0) : row.productStock;
    await db
      .update(cartItems)
      .set({ quantity: Math.min(quantity, Math.max(stock, 1)) })
      .where(eq(cartItems.id, itemId));
  }
  revalidatePath("/", "layout");
}

export async function removeCartItemById(itemId: string) {
  const db = await getDb();
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
  revalidatePath("/", "layout");
}
