import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      className={cn("inline-flex items-center rounded-full bg-[#f0f2f2] px-2 py-0.5 text-xs text-[#565959]", className)}
      {...props}
    />
  );
}
