"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { CartLineControls } from "@/components/cart-line-controls";
import { ProductImage } from "@/components/product-image";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/money";
import { FREE_SHIPPING_CENTS, shippingCents } from "@/lib/store";
import type { CartLine } from "@/lib/types";

const spring = { type: "spring" as const, duration: 0.22, bounce: 0.08 };

export function CartDrawer({
  lines,
  subtotalCents,
  count,
}: {
  lines: CartLine[];
  subtotalCents: number;
  count: number;
}) {
  const motionReduce = useReducedMotion() === true;
  const [queryReduce, setQueryReduce] = useState(false);
  const reduce = motionReduce || queryReduce;
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const itemCount = lines.reduce((sum, line) => sum + line.quantity, 0);
  const shipping = shippingCents(subtotalCents);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setQueryReduce(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  function syncMotion() {
    setQueryReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    panelRef.current?.querySelector<HTMLElement>("[data-drawer-close]")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        syncMotion();
        setOpen(false);
        return;
      }
      if (event.key !== "Tab") return;
      const panel = panelRef.current;
      if (!panel) return;
      const items = [...panel.querySelectorAll<HTMLElement>("a[href], button:not(:disabled), input, select, textarea")];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus();
    };
  }, [open]);

  const panel = (
    <AnimatePresence>
      {open ? (
        <motion.button
          key="cart-backdrop"
          type="button"
          aria-label="Close cart"
          className="fixed inset-0 z-40 cursor-pointer bg-foreground/40"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.2 }}
          onClick={() => {
            syncMotion();
            setOpen(false);
          }}
        />
      ) : null}
      {open ? (
        <motion.aside
          key="cart-panel"
          ref={panelRef}
          id="cart-drawer"
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-y-0 right-0 z-50 flex h-dvh w-full max-w-full flex-col overflow-hidden bg-background shadow-lg sm:max-w-sm sm:rounded-l-lg"
          initial={reduce ? false : { x: "100%" }}
          animate={{ x: 0 }}
          exit={reduce ? { opacity: 1 } : { x: "100%" }}
          transition={reduce ? { duration: 0 } : spring}
        >
          <div className="flex items-center justify-between gap-3 bg-primary px-4 py-3 text-primary-foreground">
            <h2 id={titleId} className="font-sans text-lg font-semibold">
              Cart
            </h2>
            <button
              type="button"
              data-drawer-close=""
              className="cursor-pointer rounded-lg bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground shadow-sm transition-colors duration-200 ease-out hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              onClick={() => {
                syncMotion();
                setOpen(false);
              }}
            >
              Close
            </button>
          </div>
          {lines.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground">
              Your cart is empty.{" "}
              <Link href="/search" className="text-foreground underline-offset-2 hover:text-primary hover:underline">
                Continue shopping
              </Link>
            </p>
          ) : (
            <ul className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {lines.map((line) => (
                <li key={line.id} className="grid grid-cols-[4rem_minmax(0,1fr)] gap-3 rounded-lg bg-card p-3 shadow-sm">
                  <Link href={`/p/${line.slug}`}>
                    <ProductImage src={line.imageUrl} alt={line.imageAlt} frameClassName="p-1" />
                  </Link>
                  <div className="min-w-0">
                    <Link href={`/p/${line.slug}`} className="line-clamp-2 text-sm font-medium text-foreground hover:text-primary">
                      {line.name}
                    </Link>
                    {line.variantLabel ? <p className="text-xs text-muted-foreground">{line.variantLabel}</p> : null}
                    <p className="mt-1 text-sm font-semibold text-foreground">{formatMoney(line.unitPriceCents)}</p>
                    <CartLineControls itemId={line.id} quantity={line.quantity} stock={line.stock} idPrefix="drawer-" />
                  </div>
                </li>
              ))}
            </ul>
          )}
          <div className="border-t border-border bg-card px-4 py-4">
            <p className="text-sm text-foreground">
              Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"}):{" "}
              <span className="font-semibold">{formatMoney(subtotalCents)}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {subtotalCents >= FREE_SHIPPING_CENTS || subtotalCents === 0
                ? `Free shipping from ${formatMoney(FREE_SHIPPING_CENTS)}.`
                : `Shipping ${formatMoney(shipping)}. Add ${formatMoney(FREE_SHIPPING_CENTS - subtotalCents)} for free shipping.`}
            </p>
            {lines.length === 0 ? (
              <Button className="mt-3 w-full" disabled>
                Proceed to checkout
              </Button>
            ) : (
              <Button asChild className="mt-3 w-full">
                <Link href="/checkout">Proceed to checkout</Link>
              </Button>
            )}
            <Link
              href="/cart"
              className="mt-2 block text-center text-sm text-foreground underline-offset-2 hover:text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              View cart
            </Link>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );

  return (
    <>
      <button
        type="button"
        data-cart-target=""
        aria-expanded={open}
        aria-controls="cart-drawer"
        aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
        className="relative inline-flex cursor-pointer items-center gap-1 bg-transparent text-sm font-semibold text-inherit"
        onClick={() => {
          syncMotion();
          setOpen(true);
        }}
      >
        <ShoppingCart className="size-6 text-accent" />
        <span className="absolute -top-2 left-4 rounded-full bg-accent px-1.5 text-xs text-accent-foreground">{count}</span>
        <span className="hidden md:inline">Cart</span>
      </button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}
