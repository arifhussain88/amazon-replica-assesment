import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutSteps } from "@/components/checkout-steps";
import { PaymentForm } from "@/components/payment-form";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { readDeliveryDraft } from "@/lib/checkout-draft";

export const metadata: Metadata = { title: "Payment" };

export default async function PaymentPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/account?next=/checkout/payment");
  const cart = await readCart();
  if (cart.lines.length === 0) redirect("/cart");
  const draft = await readDeliveryDraft();
  if (!draft) redirect("/checkout");

  return (
    <div>
      <CheckoutSteps current="payment" />
      <h1 className="mb-4 text-2xl font-semibold">Payment</h1>
      <PaymentForm lines={cart.lines} subtotalCents={cart.subtotalCents} address={draft} />
      <p className="sr-only">
        <Link href="/checkout">Back to delivery</Link>
      </p>
    </div>
  );
}
