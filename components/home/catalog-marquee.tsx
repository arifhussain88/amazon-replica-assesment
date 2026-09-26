"use client";

import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useReducedMotion } from "motion/react";
import Link from "next/link";
import { Children, useEffect, useRef, useState, type FocusEvent, type KeyboardEvent, type ReactNode } from "react";
import { Marquee } from "@/components/ui/marquee";

const controlClass =
  "inline-flex size-10 cursor-pointer items-center justify-center rounded-md border border-border bg-card text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function CatalogMarquee({
  title,
  label,
  layout,
  seeAllHref,
  children,
}: {
  title: string;
  label: string;
  layout: "grid" | "row";
  seeAllHref?: string;
  children: ReactNode;
}) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [userPlaying, setUserPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [pageHidden, setPageHidden] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.15 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onChange = () => setPageHidden(document.hidden);
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
  }, []);

  const staticView = Boolean(reduce) || !userPlaying;
  const paused = hovered || focused || !onScreen || pageHidden;
  const itemClass = staticView
    ? layout === "grid"
      ? "min-w-0"
      : "w-60 shrink-0 snap-start"
    : layout === "grid"
      ? "w-52 shrink-0"
      : "w-60 shrink-0";

  function move(direction: number) {
    setUserPlaying(false);
    window.setTimeout(() => {
      const track = trackRef.current;
      if (!track) return;
      const items = [...track.querySelectorAll<HTMLElement>("[data-marquee-item]")];
      if (items.length === 0) return;
      const current = items.findIndex((item) => item.contains(document.activeElement));
      const nextIndex =
        current < 0
          ? direction > 0
            ? 0
            : items.length - 1
          : Math.min(items.length - 1, Math.max(0, current + direction));
      const target = items[nextIndex];
      target?.querySelector<HTMLElement>("a, button")?.focus();
      if (layout === "row") {
        target?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest", inline: "nearest" });
      }
    }, 0);
  }

  function onTrackBlur(event: FocusEvent<HTMLDivElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setFocused(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    move(event.key === "ArrowRight" ? 1 : -1);
  }

  const items = wrapItems(children, itemClass);

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="min-w-0 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2>{title}</h2>
        <div className="flex items-center gap-2">
          {seeAllHref ? (
            <Link href={seeAllHref} className="cursor-pointer px-2 text-sm font-semibold text-primary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              See all
            </Link>
          ) : null}
          <button type="button" className={controlClass} aria-label={`Previous ${label}`} onClick={() => move(-1)}>
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" className={controlClass} aria-label={`Next ${label}`} onClick={() => move(1)}>
            <ChevronRight className="size-4" />
          </button>
          <button
            type="button"
            className={controlClass}
            disabled={Boolean(reduce)}
            aria-pressed={!reduce && userPlaying}
            aria-label={reduce ? `${label} animation off` : userPlaying ? `Pause ${label}` : `Play ${label}`}
            onClick={() => setUserPlaying((playing) => !playing)}
          >
            {!reduce && userPlaying ? <Pause className="size-4" /> : <Play className="size-4" />}
          </button>
        </div>
      </div>
      {staticView ? (
        <div
          ref={trackRef}
          className={
            layout === "grid"
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5"
              : "flex w-full min-w-0 snap-x gap-4 overflow-x-auto pb-1 [contain:paint]"
          }
        >
          {items}
        </div>
      ) : (
        <div
          ref={trackRef}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onFocusCapture={() => setFocused(true)}
          onBlurCapture={onTrackBlur}
        >
          <Marquee paused={paused} pauseOnHover repeat={2}>
            {items}
          </Marquee>
        </div>
      )}
    </div>
  );
}

function wrapItems(children: ReactNode, className: string) {
  return Children.map(children, (child, index) => (
    <div key={index} data-marquee-item className={className}>
      {child}
    </div>
  ));
}
