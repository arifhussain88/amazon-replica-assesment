"use server";

import { and, eq, gte, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { readCartId, rememberOrder } from "@/lib/cart";
import { getDb } from "@/lib/db";
import { cartItems, orderItems, orders, productVariants, products } from "@/lib/db/schema";
import { shippingCents } from "@/lib/store";
import { cardError, checkoutSchema } from "@/lib/validators";

export type CheckoutState = {
  error?: string;
};

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const parsed = checkoutSchema.safeParse({
    email: formData.get("email"),
    fullName: formData.get("fullName"),
    line1: formData.get("line1"),
    city: formData.get("city"),
    region: formData.get("region"),
    postalCode: formData.get("postalCode"),
    country: formData.get("country"),
    cardName: formData.get("cardName"),
    cardNumber: formData.get("cardNumber"),
    expiry: formData.get("expiry"),
    cvc: formData.get("cvc"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const paymentError = cardError(parsed.data);
  if (paymentError) return { error: paymentError };

  const cartId = await readCartId();
  if (!cartId) return { error: "Your cart is empty." };

  const db = await getDb();
  let orderNumber = "";
  try {
    orderNumber = await db.transaction(async (tx) => {
      const items = await tx.select().from(cartItems).where(eq(cartItems.cartId, cartId));
      if (items.length === 0) throw new Error("Your cart is empty.");

      const lines: Array<{
        productId: string;
        variantId: string | null;
        name: string;
        variantLabel: string | null;
        unitPriceCents: number;
        quantity: number;
      }> = [];

      for (const item of items) {
        const productRows = await tx.select().from(products).where(eq(products.id, item.productId)).limit(1);
        const product = productRows[0];
        if (!product) throw new Error("A cart item is no longer available.");

        let unitPriceCents = product.priceCents;
        if (item.variantId) {
          const updated = await tx
            .update(productVariants)
            .set({ stock: sql`${productVariants.stock} - ${item.quantity}` })
            .where(and(eq(productVariants.id, item.variantId), gte(productVariants.stock, item.quantity)))
            .returning({ priceCents: productVariants.priceCents });
          if (updated.length === 0) throw new Error(`${product.name} does not have enough stock.`);
          if (updated[0]?.priceCents != null) unitPriceCents = updated[0].priceCents;
        } else {
          const updated = await tx
            .update(products)
            .set({ stock: sql`${products.stock} - ${item.quantity}` })
            .where(and(eq(products.id, product.id), gte(products.stock, item.quantity)))
            .returning({ id: products.id });
          if (updated.length === 0) throw new Error(`${product.name} does not have enough stock.`);
        }

        lines.push({
          productId: product.id,
          variantId: item.variantId,
          name: product.name,
          variantLabel: item.variantLabel,
          unitPriceCents,
          quantity: item.quantity,
        });
      }

      const subtotal = lines.reduce((sum, line) => sum + line.unitPriceCents * line.quantity, 0);
      const shipping = shippingCents(subtotal);
      const number = makeOrderNumber();
      const orderId = crypto.randomUUID();
      await tx.insert(orders).values({
        id: orderId,
        orderNumber: number,
        email: parsed.data.email.toLowerCase(),
        fullName: parsed.data.fullName,
        line1: parsed.data.line1,
        city: parsed.data.city,
        region: parsed.data.region,
        postalCode: parsed.data.postalCode,
        country: parsed.data.country,
        subtotalCents: subtotal,
        shippingCents: shipping,
        totalCents: subtotal + shipping,
        status: "placed",
        createdAt: new Date(),
      });
      await tx.insert(orderItems).values(
        lines.map((line) => ({
          id: crypto.randomUUID(),
          orderId,
          productId: line.productId,
          variantId: line.variantId,
          name: line.name,
          variantLabel: line.variantLabel,
          unitPriceCents: line.unitPriceCents,
          quantity: line.quantity,
        })),
      );
      await tx.delete(cartItems).where(eq(cartItems.cartId, cartId));
      return number;
    });
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Could not place the order." };
  }

  await rememberOrder(orderNumber);
  revalidatePath("/", "layout");
  redirect(`/orders/${orderNumber}`);
}

function makeOrderNumber() {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `NL-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")}`;
}
