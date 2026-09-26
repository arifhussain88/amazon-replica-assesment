"use client";

import { useState, type PointerEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

export function Gallery({ images, name }: { images: { url: string; alt: string }[]; name: string }) {
  const reduce = useReducedMotion();
  const slides = images.length > 0 ? images : [{ url: "", alt: name }];
  const [active, setActive] = useState(0);
  const [origin, setOrigin] = useState<{ x: number; y: number } | null>(null);
  const [locked, setLocked] = useState(false);
  const current = slides[Math.min(active, slides.length - 1)] ?? slides[0];
  const point = origin ?? { x: 50, y: 50 };
  const zoomed = locked || origin !== null;

  function track(event: PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    setOrigin({
      x: clamp(((event.clientX - rect.left) / rect.width) * 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100),
    });
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (slides.length < 2) return;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % slides.length);
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + slides.length) % slides.length);
    }
  }

  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)] gap-3 lg:grid-cols-[72px_minmax(0,1fr)]" onKeyDown={onKeyDown}>
      <div className="flex flex-col gap-2" role="group" aria-label={`${name} photos`}>
        {slides.map((image, index) => (
          <button
            key={`${image.url}-${index}`}
            type="button"
            onClick={() => setActive(index)}
            aria-current={index === active ? "true" : undefined}
            aria-label={`Show photo ${index + 1} of ${slides.length}`}
            className={cn(
              "cursor-pointer overflow-hidden rounded-lg border bg-image shadow-sm transition-[border-color,opacity,box-shadow] duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              index === active ? "border-accent ring-2 ring-accent" : "border-border opacity-80 hover:opacity-100 hover:shadow-md",
            )}
          >
            <Frame src={image.url} alt="" />
          </button>
        ))}
      </div>
      <div className="min-w-0">
        <div
          className="relative aspect-[4/3] max-h-72 overflow-hidden rounded-lg bg-image shadow-sm lg:aspect-square lg:max-h-none"
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse" && !locked) return;
            track(event);
          }}
          onPointerLeave={() => {
            if (!locked) setOrigin(null);
          }}
          onPointerDown={(event) => {
            if (event.pointerType === "mouse") return;
            setLocked(true);
            track(event);
          }}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={`${current.url}-${active}`}
              className="absolute inset-0"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
            >
              <Frame
                src={current.url}
                alt={current.alt || name}
                className="absolute inset-0 aspect-auto"
                style={{
                  transform: zoomed ? "scale(1.8)" : "scale(1)",
                  transformOrigin: `${point.x}% ${point.y}%`,
                  transition: reduce ? "none" : "transform 200ms ease-out",
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
        <button
          type="button"
          className="mt-2 cursor-pointer rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground shadow-sm transition-shadow duration-200 ease-out hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-pressed={locked}
          onClick={() => {
            setLocked((value) => !value);
            if (locked) setOrigin(null);
          }}
        >
          {locked ? "Exit zoom" : "Zoom image"}
        </button>
      </div>
    </div>
  );
}

function Frame({
  src,
  alt,
  className,
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: { transform: string; transformOrigin: string; transition: string };
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={cn("flex aspect-square w-full items-center justify-center overflow-hidden bg-image", className)}>
      {src && !failed ? (
        // Product photos are local studio crops with mixed dimensions.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} style={style} className="h-full w-full object-cover object-center" onError={() => setFailed(true)} />
      ) : (
        <span className="text-3xl font-semibold text-muted-foreground" aria-hidden>
          {(alt || "N").slice(0, 1)}
        </span>
      )}
    </div>
  );
}

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}
