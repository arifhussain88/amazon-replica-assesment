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
      <ProductImage src={product.imageUrl} alt={product.imageAlt} />
      <div className="space-y-3">
        <p className="text-sm text-neutral-600">{product.brand}</p>
        <h2 className="text-lg font-semibold leading-snug">{product.name}</h2>
        <StarRating ratingTimes10={product.ratingTimes10} count={product.ratingCount} />
        <p className="text-sm leading-6 text-neutral-700">{product.shortDescription}</p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-neutral-700">
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
    <button type="button" className="mt-auto w-full rounded-md border border-[#d5d9d9] bg-white px-3 py-2 text-sm hover:bg-neutral-50">
      Quick view
    </button>
  );

  if (desktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent title="Quick view">{body}</DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="bottom" title="Quick view">
        {body}
      </SheetContent>
    </Sheet>
  );
}
