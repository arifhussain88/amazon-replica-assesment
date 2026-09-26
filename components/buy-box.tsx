"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { cardSurface } from "@/components/ui/card";
import type { VariantChoice } from "@/lib/types";
import { cn } from "@/lib/utils";

type Flight = {
  left: number;
  top: number;
  x: number;
  y: number;
};

export function BuyBox({
  imageUrl,
  imageAlt,
  productId,
  priceCents,
  compareAtPriceCents,
  stock,
  variants,
}: {
  imageUrl: string;
  imageAlt: string;
  productId: string;
  priceCents: number;
  compareAtPriceCents?: number | null;
  stock: number;
  variants: VariantChoice[];
}) {
  const reduce = useReducedMotion();
  const [flight, setFlight] = useState<Flight | null>(null);

  function onAdded() {
    if (reduce) return;
    const from = document.getElementById("buy-box")?.querySelector("button[type='submit']")?.getBoundingClientRect();
    const to = document.querySelector("[data-cart-target]")?.getBoundingClientRect();
    if (!from || !to) return;
    const startX = from.left + from.width / 2;
    const startY = from.top + from.height / 2;
    const endX = to.left + to.width / 2;
    const endY = to.top + to.height / 2;
    setFlight({
      left: startX - 24,
      top: startY - 24,
      x: endX - startX,
      y: endY - startY,
    });
  }

  return (
    <aside
      id="buy-box"
      className={cn(
        cardSurface,
        "z-30 h-fit p-4 max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:max-h-[45vh] max-lg:overflow-y-auto max-lg:rounded-none max-lg:border-t max-lg:border-border max-lg:shadow-none lg:sticky lg:top-4 lg:row-span-3 lg:self-start",
      )}
    >
      <AddToCartForm
        productId={productId}
        priceCents={priceCents}
        compareAtPriceCents={compareAtPriceCents}
        stock={stock}
        variants={variants}
        onAdded={onAdded}
      />
      <p className="mt-3 text-sm text-muted-foreground">Ships as a demo order. Free shipping on qualifying totals.</p>
      {flight ? (
        <motion.img
          src={imageUrl}
          alt={imageAlt}
          aria-hidden
          data-cart-flight=""
          className="pointer-events-none fixed z-50 size-12 rounded-lg bg-image object-contain"
          style={{ left: flight.left, top: flight.top }}
          initial={{ x: 0, y: 0, opacity: 1 }}
          animate={{ x: flight.x, y: flight.y, opacity: 0.15 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          onAnimationComplete={() => setFlight(null)}
        />
      ) : null}
    </aside>
  );
}
