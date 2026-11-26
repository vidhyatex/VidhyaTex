"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type StripProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  ariaLabel?: string;
  /** Prev / next buttons that scroll one card at a time. Swipe always works. */
  showArrows?: boolean;
};

type ItemProps = {
  children: ReactNode;
  className?: string;
};

export function HomeScrollSnapStrip({
  children,
  className,
  trackClassName,
  ariaLabel,
  showArrows = false,
}: StripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const updateEdges = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < maxScroll - 4);
  }, []);

  useEffect(() => {
    if (!showArrows) return;
    const el = trackRef.current;
    if (!el) return;

    updateEdges();
    el.addEventListener("scroll", updateEdges, { passive: true });
    const observer = new ResizeObserver(updateEdges);
    observer.observe(el);

    return () => {
      el.removeEventListener("scroll", updateEdges);
      observer.disconnect();
    };
  }, [showArrows, updateEdges]);

  const scrollByCard = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const item = el.querySelector<HTMLElement>(".scroll-snap-item");
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const step = item ? item.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const arrowClass =
    "absolute top-[40%] z-[3] flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/90 text-foreground shadow-md ring-1 ring-black/10 transition-opacity disabled:pointer-events-none disabled:opacity-0 sm:h-10 sm:w-10";

  return (
    <div
      className={cn("scroll-snap-strip -mx-4 px-4 sm:mx-0 sm:px-0", className)}
    >
      <div
        ref={trackRef}
        className={cn("scroll-snap-strip__track", trackClassName)}
        role="list"
        aria-label={ariaLabel}
      >
        {children}
      </div>
      {showArrows ? (
        <>
          <button
            type="button"
            aria-label="Previous products"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            className={cn(arrowClass, "left-1 sm:left-2")}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            aria-label="Next products"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            className={cn(arrowClass, "right-1 sm:right-2")}
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>
        </>
      ) : null}
    </div>
  );
}

export function ScrollSnapItem({ children, className }: ItemProps) {
  return (
    <div role="listitem" className={cn("scroll-snap-item", className)}>
      {children}
    </div>
  );
}

export const scrollSnapCategoryItemClass =
  "w-[86vw] max-w-[360px] shrink-0 grow-0 sm:w-auto sm:max-w-none sm:basis-[62%] md:basis-[44%] lg:basis-[34%] xl:basis-[30%]";

export const scrollSnapFeaturedItemClass =
  "w-[80vw] max-w-[320px] shrink-0 grow-0 sm:w-auto sm:max-w-none sm:basis-[58%] md:basis-[42%] lg:basis-[32%] xl:basis-[28%]";

/** Product grids (e.g. "We Think You'll Love"): one large card per swipe on mobile, 2 up on sm, 4 up on lg. */
export const scrollSnapRecommendationItemClass =
  "w-[80vw] max-w-[320px] shrink-0 grow-0 sm:w-auto sm:max-w-none sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]";

export const scrollSnapReelItemClass =
  "w-[44vw] max-w-[180px] shrink-0 grow-0 sm:w-auto sm:max-w-none sm:basis-[34%] md:basis-[26%] lg:basis-[20%]";

export const scrollSnapPriceItemClass =
  "w-[42vw] max-w-[180px] shrink-0 grow-0 sm:w-auto sm:max-w-none sm:basis-[28%] md:basis-[24%] lg:basis-[22%] xl:basis-[20%]";
