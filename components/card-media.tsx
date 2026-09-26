"use client";

import { useState } from "react";
import { useReducedMotion } from "motion/react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function CardMedia({
  images,
  fill = false,
}: {
  images: { url: string; alt: string }[];
  fill?: boolean;
}) {
  const reduce = useReducedMotion();
  const slides = images.filter((image) => image.url);
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(slides.length === 0);
  const current = slides.length === 0 ? 0 : Math.min(active, slides.length - 1);

  return (
    <div
      className={cn("group relative overflow-hidden rounded-lg bg-image", fill ? "aspect-[16/10]" : "aspect-square")}
      onMouseEnter={() => {
        if (slides.length > 1) setActive(1);
      }}
      onMouseLeave={() => setActive(0)}
    >
      {ready ? null : <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      {slides.map((image, index) => (
        // Product photos are local studio crops with mixed dimensions.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`${image.url}-${index}`}
          src={image.url}
          alt={index === current ? image.alt : ""}
          aria-hidden={index === current ? undefined : true}
          ref={(node) => {
            if (index === 0 && node?.complete) setReady(true);
          }}
          className={cn(
            "absolute inset-0 h-full w-full object-contain p-3 transition-[transform,opacity] duration-200 ease-out",
            index === current ? "opacity-100" : "pointer-events-none opacity-0",
            ready ? "" : "opacity-0",
            reduce ? "" : "group-hover:scale-105",
          )}
          onLoad={() => {
            if (index === 0) setReady(true);
          }}
          onError={() => {
            if (index === 0) setReady(true);
          }}
        />
      ))}
    </div>
  );
}
