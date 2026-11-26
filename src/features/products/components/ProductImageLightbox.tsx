"use client";

import React, { useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { StorefrontImage } from "@/components/media/StorefrontImage";
import { cn, keytoUrl } from "@/lib/utils";

export type LightboxImage = {
  id: string;
  key: string;
  alt: string;
};

type Props = {
  images: LightboxImage[];
  index: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onIndexChange: (index: number) => void;
  title: string;
};

const SWIPE_MIN_PX = 50;

/**
 * Fullscreen product photo viewer: tap/click to zoom, swipe or arrow keys to
 * change photo. Reuses the same image URL as the page (no extra download).
 */
export function ProductImageLightbox({
  images,
  index,
  open,
  onOpenChange,
  onIndexChange,
  title,
}: Props) {
  const [zoomed, setZoomed] = useState(false);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const count = images.length;
  const safeIndex = count === 0 ? 0 : Math.min(Math.max(index, 0), count - 1);
  const image = images[safeIndex];
  const canPrev = safeIndex > 0;
  const canNext = safeIndex < count - 1;

  // Every new photo (or reopen) starts fitted to the screen.
  useEffect(() => {
    setZoomed(false);
  }, [safeIndex, open]);

  // When zooming in, start from the middle of the photo.
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    if (zoomed) {
      el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2;
      el.scrollTop = (el.scrollHeight - el.clientHeight) / 2;
    } else {
      el.scrollLeft = 0;
      el.scrollTop = 0;
    }
  }, [zoomed]);

  const goPrev = () => {
    if (canPrev) onIndexChange(safeIndex - 1);
  };
  const goNext = () => {
    if (canNext) onIndexChange(safeIndex + 1);
  };

  if (!image) return null;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[300] bg-black" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className="fixed inset-0 z-[301] flex flex-col text-white outline-none"
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") goPrev();
            if (event.key === "ArrowRight") goNext();
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>

          <div className="flex h-14 shrink-0 items-center justify-between px-3">
            <span className="min-w-12 text-sm tabular-nums text-white/80">
              {count > 1 ? `${safeIndex + 1} / ${count}` : ""}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setZoomed((value) => !value)}
                aria-label={zoomed ? "Zoom out" : "Zoom in"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                {zoomed ? (
                  <ZoomOut className="h-5 w-5" aria-hidden />
                ) : (
                  <ZoomIn className="h-5 w-5" aria-hidden />
                )}
              </button>
              <DialogPrimitive.Close
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <X className="h-5 w-5" aria-hidden />
              </DialogPrimitive.Close>
            </div>
          </div>

          <div
            ref={scrollerRef}
            className="relative flex min-h-0 flex-1 overflow-auto overscroll-contain"
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current =
                zoomed || event.touches.length > 1 || !touch
                  ? null
                  : { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              const touch = event.changedTouches[0];
              if (!start || !touch) return;
              const dx = touch.clientX - start.x;
              const dy = touch.clientY - start.y;
              if (Math.abs(dx) < SWIPE_MIN_PX) return;
              if (Math.abs(dx) < Math.abs(dy) * 1.5) return;
              if (dx < 0) goNext();
              else goPrev();
            }}
          >
            <div className="m-auto">
              <StorefrontImage
                key={image.id}
                src={keytoUrl(image.key)}
                alt={image.alt || title}
                width={960}
                height={1280}
                sizes="100vw"
                optimizeWidth={800}
                priority
                onClick={() => setZoomed((value) => !value)}
                className={cn(
                  "h-auto select-none",
                  zoomed
                    ? "w-[min(250vw,1280px)] max-w-none cursor-zoom-out"
                    : "max-h-[calc(100dvh-7rem)] w-auto max-w-[100vw] cursor-zoom-in object-contain",
                )}
              />
            </div>
          </div>

          {count > 1 ? (
            <>
              <button
                type="button"
                aria-label="Previous image"
                onClick={goPrev}
                disabled={!canPrev}
                className="absolute left-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronLeft className="h-6 w-6" aria-hidden />
              </button>
              <button
                type="button"
                aria-label="Next image"
                onClick={goNext}
                disabled={!canNext}
                className="absolute right-2 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 disabled:pointer-events-none disabled:opacity-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <ChevronRight className="h-6 w-6" aria-hidden />
              </button>
            </>
          ) : null}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
