"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { variantLabel } from "@/lib/catalog";
import { ensureCart } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { cartItems, productVariants, products } from "@/lib/db/schema";

export type CartActionState = {
  ok?: boolean;
  error?: string;
};

export async function addToCart(_prev: CartActionState, formData: FormData): Promise<CartActionState> {
  const productId = String(formData.get("productId") ?? "");
  const variantId = String(formData.get("variantId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
  if (!productId || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
    return { error: "Choose a quantity between 1 and 20." };
  }

  const db = await getDb();
  const productRows = await db.select().from(products).where(eq(products.id, productId)).limit(1);
  const product = productRows[0];
  if (!product) return { error: "That product is no longer available." };

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, productId));

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

export async function updateCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const quantity = Number(formData.get("quantity") ?? 1);
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

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const db = await getDb();
  await db.delete(cartItems).where(eq(cartItems.id, itemId));
  revalidatePath("/", "layout");
}
