import type { Metadata } from "next";
import Link from "next/link";
import { CartLineControls } from "@/components/cart-line-controls";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { readCart } from "@/lib/cart";
import { formatMoney } from "@/lib/money";
import { FREE_SHIPPING_CENTS, shippingCents } from "@/lib/store";

export const metadata: Metadata = { title: "Cart" };

export default async function CartPage() {
  const { lines, subtotalCents } = await readCart();
  const shipping = shippingCents(subtotalCents);
  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
      <section className="rounded-md bg-white p-5">
        <h1 className="text-2xl font-semibold">Shopping cart</h1>
        {lines.length === 0 ? (
          <p className="mt-4 text-sm">
            Your cart is empty. <Link href="/search" className="text-[#1a5276]">Continue shopping</Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[#e3e6e6]">
            {lines.map((line) => (
              <li key={line.id} className="grid grid-cols-[96px_minmax(0,1fr)] gap-4 py-4">
                <Link href={`/p/${line.slug}`}>
                  <ProductImage src={line.imageUrl} alt={line.imageAlt} />
                </Link>
                <div>
                  <Link href={`/p/${line.slug}`} className="font-medium hover:text-[#1a5276]">
                    {line.name}
                  </Link>
                  {line.variantLabel ? <p className="text-sm text-neutral-600">{line.variantLabel}</p> : null}
                  <p className="mt-1 text-sm font-semibold">{formatMoney(line.unitPriceCents)}</p>
                  <CartLineControls itemId={line.id} quantity={line.quantity} stock={line.stock} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <aside className="h-fit rounded-md border border-[#e3e6e6] bg-white p-5">
        <p className="text-lg">
          Subtotal ({lines.reduce((sum, line) => sum + line.quantity, 0)} items):{" "}
          <span className="font-semibold">{formatMoney(subtotalCents)}</span>
        </p>
        <p className="mt-2 text-sm text-neutral-600">
          {subtotalCents >= FREE_SHIPPING_CENTS || subtotalCents === 0
            ? `Free shipping from ${formatMoney(FREE_SHIPPING_CENTS)}.`
            : `Shipping ${formatMoney(shipping)}. Add ${formatMoney(FREE_SHIPPING_CENTS - subtotalCents)} for free shipping.`}
        </p>
        {lines.length === 0 ? (
          <Button className="mt-4 w-full" disabled>
            Proceed to checkout
          </Button>
        ) : (
          <Button asChild className="mt-4 w-full">
            <Link href="/checkout">Proceed to checkout</Link>
          </Button>
        )}
      </aside>
    </div>
  );
}
