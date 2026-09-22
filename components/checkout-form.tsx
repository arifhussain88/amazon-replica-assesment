"use client";

import { useActionState, type ComponentProps } from "react";
import { placeOrder, type CheckoutState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/money";
import { FREE_SHIPPING_CENTS, shippingCents } from "@/lib/store";
import type { CartLine } from "@/lib/types";

const initial: CheckoutState = {};

export function CheckoutForm({ lines, subtotalCents }: { lines: CartLine[]; subtotalCents: number }) {
  const [state, action, pending] = useActionState(placeOrder, initial);
  const shipping = shippingCents(subtotalCents);
  const total = subtotalCents + shipping;

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-6 rounded-md border border-[#e3e6e6] bg-white p-5">
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Delivery</h2>
          <Field label="Email" name="email" type="email" autoComplete="email" />
          <Field label="Full name" name="fullName" autoComplete="name" />
          <Field label="Street address" name="line1" autoComplete="address-line1" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="City" name="city" autoComplete="address-level2" />
            <Field label="State or region" name="region" autoComplete="address-level1" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Postal code" name="postalCode" autoComplete="postal-code" />
            <div className="space-y-1">
              <Label htmlFor="country">Country</Label>
              <select id="country" name="country" defaultValue="United States" className="h-10 w-full rounded-md border border-[#888] bg-white px-3 text-sm">
                <option>United States</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
            </div>
          </div>
          <p className="text-xs text-neutral-600">Prices stay in USD. Free shipping on orders of {formatMoney(FREE_SHIPPING_CENTS)} or more.</p>
        </section>
        <section className="space-y-3 border-t border-[#e3e6e6] pt-5">
          <h2 className="text-lg font-semibold">Payment</h2>
          <p className="text-sm text-neutral-600">The card is validated and not charged. Use 4242 4242 4242 4242, any future expiry, and any 3-digit code.</p>
          <Field label="Name on card" name="cardName" autoComplete="cc-name" />
          <Field label="Card number" name="cardNumber" inputMode="numeric" autoComplete="cc-number" />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Expiration (MM/YY)" name="expiry" autoComplete="cc-exp" placeholder="09/28" />
            <Field label="Security code" name="cvc" inputMode="numeric" autoComplete="cc-csc" />
          </div>
        </section>
        {state.error ? <p className="text-sm text-[#b12704]">{state.error}</p> : null}
        <Button type="submit" size="lg" className="w-full lg:hidden" disabled={pending}>
          {pending ? "Placing order..." : `Place order · ${formatMoney(total)}`}
        </Button>
      </div>
      <aside className="rounded-md border border-[#e3e6e6] bg-white p-5 lg:sticky lg:top-4">
        <h2 className="text-lg font-semibold">Order summary</h2>
        <ul className="mt-4 space-y-3">
          {lines.map((line) => (
            <li key={line.id} className="flex justify-between gap-3 text-sm">
              <span>
                {line.name}
                {line.variantLabel ? <span className="block text-neutral-500">{line.variantLabel}</span> : null}
                <span className="block text-neutral-500">Qty {line.quantity}</span>
              </span>
              <span>{formatMoney(line.unitPriceCents * line.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-[#e3e6e6] pt-4 text-sm">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd>{formatMoney(subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd>{shipping === 0 ? "Free" : formatMoney(shipping)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Order total</dt>
            <dd>{formatMoney(total)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" className="mt-4 hidden w-full lg:inline-flex" disabled={pending}>
          {pending ? "Placing order..." : "Place order"}
        </Button>
      </aside>
    </form>
  );
}

function Field({
  label,
  name,
  ...props
}: { label: string; name: string } & ComponentProps<"input">) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required {...props} />
    </div>
  );
}
