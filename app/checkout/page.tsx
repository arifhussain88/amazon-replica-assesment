import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutSteps } from "@/components/checkout-steps";
import { DeliveryForm } from "@/components/checkout-form";
import { cardSurface } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { readCart } from "@/lib/cart";
import { readDeliveryDraft } from "@/lib/checkout-draft";
import { cn } from "@/lib/utils";

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
        <p className={cn(cardSurface, "p-5 text-sm")}>
          Your cart is empty. <Link href="/search" className="text-primary">Browse products</Link>
        </p>
      ) : (
        <DeliveryForm lines={cart.lines} subtotalCents={cart.subtotalCents} email={user.email} defaults={draft} />
      )}
    </div>
  );
}
