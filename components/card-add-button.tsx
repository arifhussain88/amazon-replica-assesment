"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { VariantChoice } from "@/lib/types";

type CartFormState = {
  ok?: boolean;
  error?: string;
};

const initial: CartFormState = {};

export function CardAddButton({
  productId,
  stock,
  variants,
}: {
  productId: string;
  stock: number;
  variants: VariantChoice[];
}) {
  const router = useRouter();
  const [state, setState] = useState(initial);
  const [pending, setPending] = useState(false);
  const availableVariants = variants.filter((variant) => variant.stock > 0);
  const [variantId, setVariantId] = useState(availableVariants[0]?.id ?? variants[0]?.id ?? "");
  const selected = variants.find((variant) => variant.id === variantId);
  const available = variants.length > 0 ? (selected?.stock ?? 0) : stock;

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setState({});
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, variantId, quantity: 1 }),
      });
      const data: unknown = await response.json();
      if (!response.ok) {
        setState({ error: messageFrom(data, "Could not add to cart.") });
        return;
      }
      setState({ ok: true });
      router.refresh();
    } catch {
      setState({ error: "Could not add to cart." });
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-auto space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value="1" />
      <div className="min-h-14">
        {variants.length > 0 ? (
          <label className="block text-xs text-muted-foreground">
            {variants[0]?.optionName}
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="mt-1 h-9 w-full rounded-lg border border-input bg-card px-2 text-sm text-foreground shadow-sm"
            >
              {variants.map((variant) => (
                <option key={variant.id} value={variant.id} disabled={variant.stock <= 0}>
                  {variant.optionValue}
                  {variant.stock <= 0 ? " (out of stock)" : ""}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>
      {state.error ? <p className="text-xs text-destructive">{state.error}</p> : null}
      {state.ok ? <p className="text-xs text-primary">Added to cart</p> : null}
      <Button type="submit" className="w-full" disabled={pending || available <= 0}>
        {available <= 0 ? "Out of stock" : pending ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}

function messageFrom(data: unknown, fallback: string) {
  if (data && typeof data === "object" && "message" in data && typeof data.message === "string") return data.message;
  return fallback;
}
