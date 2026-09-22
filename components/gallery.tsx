"use client";

import { useState } from "react";
import { ProductImage } from "@/components/product-image";

export function Gallery({ images, name }: { images: { url: string; alt: string }[]; name: string }) {
  const slides = images.length > 0 ? images : [{ url: "", alt: name }];
  const [active, setActive] = useState(0);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const current = slides[Math.min(active, slides.length - 1)] ?? slides[0];

  return (
    <div className="grid grid-cols-[64px_1fr] gap-3 lg:grid-cols-[72px_1fr]">
      <div className="flex flex-col gap-2">
        {slides.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-md border ${index === active ? "border-[#e77600]" : "border-[#d5d9d9]"}`}
            aria-label={`Show image ${index + 1}`}
          >
            <ProductImage src={image.url} alt="" frameClassName="p-1" />
          </button>
        ))}
      </div>
      <div
        className="relative"
        onMouseMove={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          setPos({
            x: ((event.clientX - rect.left) / rect.width) * 100,
            y: ((event.clientY - rect.top) / rect.height) * 100,
          });
        }}
        onMouseLeave={() => setPos(null)}
      >
        <ProductImage src={current.url} alt={current.alt || name} frameClassName="rounded-md border border-[#e3e6e6]" />
        {pos && current.url ? (
          <div
            className="pointer-events-none absolute top-0 left-full z-10 ml-4 hidden h-full w-[120%] rounded-md border border-[#e3e6e6] bg-[#f7f7f7] lg:block"
            style={{
              backgroundImage: `url(${current.url})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "180%",
              backgroundPosition: `${pos.x}% ${pos.y}%`,
            }}
            aria-hidden
          />
        ) : null}
      </div>
    </div>
  );
}
