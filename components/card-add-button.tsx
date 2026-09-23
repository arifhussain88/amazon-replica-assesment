"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { addToCart, type CartActionState } from "@/app/actions/cart";
import { Button } from "@/components/ui/button";
import type { VariantChoice } from "@/lib/types";

const initial: CartActionState = {};

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
  const [state, action, pending] = useActionState(addToCart, initial);
  const availableVariants = variants.filter((variant) => variant.stock > 0);
  const [variantId, setVariantId] = useState(availableVariants[0]?.id ?? variants[0]?.id ?? "");
  const selected = variants.find((variant) => variant.id === variantId);
  const available = variants.length > 0 ? (selected?.stock ?? 0) : stock;

  useEffect(() => {
    if (state.ok) router.refresh();
  }, [state.ok, router]);

  return (
    <form action={action} className="mt-auto space-y-2">
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="variantId" value={variantId} />
      <input type="hidden" name="quantity" value="1" />
      <div className="min-h-14">
        {variants.length > 0 ? (
          <label className="block text-xs text-neutral-600">
            {variants[0]?.optionName}
            <select
              value={variantId}
              onChange={(event) => setVariantId(event.target.value)}
              className="mt-1 h-9 w-full rounded-md border border-[#888] bg-white px-2 text-sm text-[#111]"
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
      {state.error ? <p className="text-xs text-[#b12704]">{state.error}</p> : null}
      {state.ok ? <p className="text-xs text-[#067d62]">Added to cart</p> : null}
      <Button type="submit" className="w-full" disabled={pending || available <= 0}>
        {available <= 0 ? "Out of stock" : pending ? "Adding..." : "Add to cart"}
      </Button>
    </form>
  );
}
