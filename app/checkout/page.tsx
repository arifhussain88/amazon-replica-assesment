import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout-form";
import { readCart } from "@/lib/cart";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const cart = await readCart();
  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Checkout</h1>
      {cart.lines.length === 0 ? (
        <p className="rounded-md bg-white p-5 text-sm">
          Your cart is empty. <Link href="/search" className="text-[#1a5276]">Browse products</Link>
        </p>
      ) : (
        <CheckoutForm lines={cart.lines} subtotalCents={cart.subtotalCents} />
      )}
    </div>
  );
}
