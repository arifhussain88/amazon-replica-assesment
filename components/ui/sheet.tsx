"use client";

import type { ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  side = "left",
  className,
  children,
  title,
}: {
  side?: "left" | "bottom";
  className?: string;
  children: ReactNode;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50" />
      <Dialog.Content
        className={cn(
          "fixed z-50 bg-card shadow-md focus:outline-none",
          side === "left" ? "inset-y-0 left-0 w-[min(100%,22rem)] overflow-y-auto" : "inset-x-0 bottom-0 max-h-[88vh] overflow-y-auto rounded-t-lg",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <Dialog.Title className="text-base font-semibold">{title}</Dialog.Title>
          <Dialog.Close className="rounded-lg p-1 hover:bg-image" aria-label="Close">
            <X className="size-5" />
          </Dialog.Close>
        </div>
        <div className="p-4">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
