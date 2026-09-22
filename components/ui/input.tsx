import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-10 w-full rounded-md border border-[#888] bg-white px-3 text-sm outline-none focus:border-[#e77600] focus:ring-2 focus:ring-[#f5b942]",
        className,
      )}
      {...props}
    />
  );
}
