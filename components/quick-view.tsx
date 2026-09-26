"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AddToCartForm } from "@/components/add-to-cart-form";
import { ProductImage } from "@/components/product-image";
import { StarRating } from "@/components/star-rating";
import type { ProductCard } from "@/lib/types";

export function QuickView({ product }: { product: ProductCard }) {
  const [open, setOpen] = useState(false);
  const [desktop, setDesktop] = useState(true);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");
    const apply = () => setDesktop(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  const body = (
    <div className="grid gap-4 sm:grid-cols-[180px_1fr]">
      <ProductImage src={product.imageUrl} alt={product.imageAlt} frameClassName="shadow-sm" />
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">{product.brand}</p>
        <h2 className="font-sans text-lg font-semibold leading-snug text-foreground">{product.name}</h2>
        <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
        <p className="text-sm leading-6 text-muted-foreground">{product.shortDescription}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
          {product.features.slice(0, 3).map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
        <AddToCartForm
          productId={product.id}
          priceCents={product.priceCents}
          compareAtPriceCents={product.compareAtPriceCents}
          stock={product.stock}
          variants={product.variants}
          compact
          onAdded={() => setOpen(false)}
        />
      </div>
    </div>
  );

  const trigger = (
    <button
      type="button"
      className="w-full cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground shadow-sm transition-shadow duration-200 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      Quick view
    </button>
  );

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent title="Quick view" className="rounded-lg bg-card shadow-md">
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" title="Quick view" className="rounded-t-lg bg-card shadow-md">
        {body}
      </SheetContent>
    </Sheet>
  );
}
