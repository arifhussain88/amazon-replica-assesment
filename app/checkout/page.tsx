import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutSteps } from "@/components/checkout-steps";
import { DeliveryForm } from "@/components/checkout-form";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { readDeliveryDraft } from "@/lib/checkout-draft";

export const metadata: Metadata = { title: "Checkout" };

export default async function CheckoutPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account?next=/checkout");
  const cart = await readCart();
  const draft = await readDeliveryDraft();

  return (
    <div>
      <CheckoutSteps current="delivery" />
      <h1 className="mb-4 text-2xl font-semibold">Delivery</h1>
      {cart.lines.length === 0 ? (
        <p className="rounded-md bg-white p-5 text-sm">
          Your cart is empty. <Link href="/search" className="text-[#1a5276]">Browse products</Link>
        </p>
      ) : (
        <DeliveryForm lines={cart.lines} subtotalCents={cart.subtotalCents} email={user.email} defaults={draft} />
      )}
    </div>
  );
}
