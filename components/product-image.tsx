"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function ProductImage({
  src,
  alt,
  className,
  frameClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  frameClassName?: string;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("flex aspect-square items-center justify-center bg-[#f7f7f7] p-3", frameClassName)}>
      {src && !failed ? (
        // Product photos are local studio crops with mixed dimensions.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={cn("h-full w-full object-contain", className)} onError={() => setFailed(true)} />
      ) : (
        <span className="text-3xl font-semibold text-neutral-300" aria-hidden>
          {alt.slice(0, 1)}
        </span>
      )}
    </div>
  );
}
