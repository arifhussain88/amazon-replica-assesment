"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PriceTag } from "@/components/price-tag";
import { stockFor } from "@/lib/pricing";
import type { VariantChoice } from "@/lib/types";

type CartFormState = {
  ok?: boolean;
  error?: string;
};

const initial: CartFormState = {};

export function AddToCartForm({
  productId,
  priceCents,
  compareAtPriceCents,
  stock,
  variants,
  compact = false,
  onAdded,
}: {
  productId: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stock: number;
  variants: VariantChoice[];
  compact?: boolean;
  onAdded?: () => void;
}) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [pending, setPending] = useState(false);
  const [variantId, setVariantId] = useState(variants.find((variant) => variant.stock > 0)?.id ?? variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const selected = variants.find((variant) => variant.id === variantId);
  const available = stockFor({ stock, variants }, variants.length ? variantId : null);
  const selectedPrice = selected?.priceCents ?? priceCents;
  const optionName = variants[0]?.optionName;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setState({});
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setState({ error: messageFrom(data, "Could not add to cart.") });
        return;
      }
      setState({ ok: true });
      router.refresh();
      onAdded?.();
    } catch {
      setState({ error: "Could not add to cart." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={variantId} />
      <PriceTag
        priceCents={priceCents}
        compareAtPriceCents={compareAtPriceCents}
        variants={variants}
        selectedPriceCents={variants.length ? selectedPrice : undefined}
      />
      <div className="min-h-16">
        {optionName ? (
          <fieldset>
            <legend className="mb-2 text-sm font-medium">{optionName}</legend>
            <div className="flex flex-wrap gap-2">
              {variants.map((variant) => {
                const active = variant.id === variantId;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    disabled={variant.stock <= 0}
                    onClick={() => setVariantId(variant.id)}
                    className={`rounded-md border px-3 py-1.5 text-sm disabled:opacity-40 ${active ? "border-[#e77600] ring-2 ring-[#f5b942]" : "border-[#d5d9d9]"}`}
                  >
                    {variant.optionValue}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ) : null}
      </div>
      <p className={`text-sm ${available > 0 ? "text-[#067d62]" : "text-[#b12704]"}`}>
        {available > 0 ? (available <= 5 ? `Only ${available} left in stock` : "In stock") : "Out of stock"}
      </p>
      <label className="flex items-center gap-2 text-sm">
        Quantity
        <select
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="h-10 rounded-md border border-[#888] bg-white px-2"
        >
          {Array.from({ length: Math.max(1, Math.min(available, 20)) }, (_, index) => (
            <option key={index + 1} value={index + 1}>
              {index + 1}
            </option>
          ))}
        </select>
      </label>
      {state.error ? <p className="text-sm text-[#b12704]">{state.error}</p> : null}
      {state.ok && !compact ? <p className="text-sm text-[#067d62]">Added to cart.</p> : null}
      <Button type="submit" size={compact ? "default" : "lg"} className="w-full" disabled={pending || available <= 0}>
        {pending ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}

function messageFrom(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data && typeof data.message === "string") return data.message;
  return fallback;
}
