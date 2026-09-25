"use client";

import { useState, type ComponentProps, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartSummary } from "@/components/checkout-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { shippingCents } from "@/lib/store";
import type { AddressInput } from "@/lib/validators";
import type { CartLine } from "@/lib/types";

type CheckoutState = {
  error?: string;
};

const initial: CheckoutState = {};

export function PaymentForm({
  lines,
  subtotalCents,
  address,
}: {
  lines: CartLine[];
  subtotalCents: number;
  address: AddressInput;
}) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [pending, setPending] = useState(false);
  const shipping = shippingCents(subtotalCents);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setPending(true);
    setState({});
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cardName: form.get("cardName"),
          cardNumber: form.get("cardNumber"),
          expiry: form.get("expiry"),
          cvc: form.get("cvc"),
        }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setState({ error: messageFrom(data, "Could not place the order.") });
        setPending(false);
        return;
      }
      const orderNumber =
        data && typeof data === "object" && "orderNumber" in data && typeof data.orderNumber === "string"
          ? data.orderNumber
          : "";
      router.push(orderNumber ? `/orders/${orderNumber}` : "/orders");
      router.refresh();
    } catch {
      setState({ error: "Could not place the order." });
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4 rounded-md border border-[#e3e6e6] bg-white p-5">
        <h2 className="text-lg font-semibold">Payment</h2>
        <p className="text-sm leading-6 text-neutral-700">
          {address.fullName}
          <br />
          {address.line1}
          <br />
          {address.city}, {address.region} {address.postalCode}
          <br />
          {address.country}
        </p>
        <Link href="/checkout" className="inline-block text-sm text-[#1a5276]">
          Edit delivery details
        </Link>
        <p className="text-sm text-neutral-600">The card is validated and not charged. Use 4242 4242 4242 4242, any future expiry, and any 3-digit code.</p>
        <Field label="Name on card" name="cardName" autoComplete="cc-name" />
        <Field label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Expiration (MM/YY)" name="expiry" autoComplete="cc-exp" placeholder="09/28" />
          <Field label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" />
        </div>
        {state.error ? <p className="text-sm text-[#b12704]">{state.error}</p> : null}
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Placing order..." : "Place order"}
        </Button>
      </div>
      <CartSummary lines={lines} subtotalCents={subtotalCents} shipping={shipping} />
    </form>
  );
}

function messageFrom(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "error" in data && typeof data.error === "string") return data.error;
  return fallback;
}

function Field({ label, name, ...props }: { label: string; name: string } & ComponentProps<"input">) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required {...props} />
    </div>
  );
}
