"use client";

import { useActionState, type ComponentProps } from "react";
import { saveDelivery, type CheckoutState } from "@/app/actions/checkout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatMoney } from "@/lib/money";
import { shippingCents } from "@/lib/store";
import type { AddressInput } from "@/lib/validators";
import type { CartLine } from "@/lib/types";

const initial: CheckoutState = {};

export function DeliveryForm({
  lines,
  subtotalCents,
  email,
  defaults,
}: {
  lines: CartLine[];
  subtotalCents: number;
  email: string;
  defaults?: AddressInput | null;
}) {
  const [state, action, pending] = useActionState(saveDelivery, initial);
  const shipping = shippingCents(subtotalCents);

  return (
    <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-4 rounded-md border border-[#e3e6e6] bg-white p-5">
        <h2 className="text-lg font-semibold">Delivery details</h2>
        <p className="text-sm text-neutral-600">Signing in as {email}. The next step is payment.</p>
        <Field label="Full name" name="fullName" autoComplete="name" defaultValue={defaults?.fullName} />
        <Field label="Street address" name="line1" autoComplete="address-line1" defaultValue={defaults?.line1} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="City" name="city" autoComplete="address-level2" defaultValue={defaults?.city} />
          <Field label="State or region" name="region" autoComplete="address-level1" defaultValue={defaults?.region} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Postal code" name="postalCode" autoComplete="postal-code" defaultValue={defaults?.postalCode} />
          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              name="country"
              defaultValue={defaults?.country ?? "United States"}
              className="h-10 w-full rounded-md border border-[#888] bg-white px-3 text-sm"
            >
              <option>United States</option>
              <option>Canada</option>
              <option>United Kingdom</option>
            </select>
          </div>
        </div>
        {state.error ? <p className="text-sm text-[#b12704]">{state.error}</p> : null}
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Saving..." : "Continue to payment"}
        </Button>
      </div>
      <CartSummary lines={lines} subtotalCents={subtotalCents} shipping={shipping} />
    </form>
  );
}

export function CartSummary({
  lines,
  subtotalCents,
  shipping,
}: {
  lines: CartLine[];
  subtotalCents: number;
  shipping: number;
}) {
  return (
    <aside className="rounded-md border border-[#e3e6e6] bg-white p-5">
      <h2 className="text-lg font-semibold">Items</h2>
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
          <dd>{formatMoney(subtotalCents + shipping)}</dd>
        </div>
      </dl>
    </aside>
  );
}

function Field({ label, name, ...props }: { label: string; name: string } & ComponentProps<"input">) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} required {...props} />
    </div>
  );
}
