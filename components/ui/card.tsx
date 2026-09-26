import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export const cardSurface =
  "rounded-lg bg-card text-card-foreground shadow-sm transition-shadow duration-200 ease-out hover:shadow-md";

export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn(cardSurface, className)} {...props} />;
}
