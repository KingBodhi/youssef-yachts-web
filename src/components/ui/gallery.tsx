"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { useEntrance } from "@/lib/use-entrance";

interface GalleryProps {
  images: string[];
  /** Used to build alt text: "<title>, image 3 of 6". */
  title: string;
  className?: string;
}

/**
 * Cover image plus a supporting grid, with a keyboard-navigable lightbox.
 * Every yacht ships exactly 11 images: one cover (index 0), shown large, and
 * ten supporting shots laid out as a 2 x 5 grid on desktop. The lightbox still
 * cycles all 11. The grid reflows to fewer columns on smaller screens.
 */
export function Gallery({ images, title, className }: GalleryProps) {
  const heroRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();
  const railEntrance = useEntrance(0.3);
  const [index, setIndex] = useState<number | null>(null);
  const open = index !== null;

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "12%"]);

  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? i : (i + 1) % images.length)),
    [images.length]
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? i : (i - 1 + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close, next, prev]);

  return (
    <div className={className}>
      {/* Lead image */}
      <motion.button
        type="button"
        ref={heroRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE }}
        onClick={() => setIndex(0)}
        aria-label={`Open the gallery for ${title}`}
        className="group relative mb-4 block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-border bg-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:aspect-[16/10] lg:aspect-[16/9]"
      >
        <motion.div style={{ scale, y }} className="absolute inset-0 will-change-transform">
          <Image
            src={images[0]}
            alt={`${title}, image 1 of ${images.length}`}
            fill
            className="object-cover object-[50%_38%]"
            sizes="(max-width: 1280px) 100vw, 1280px"
            priority
          />
        </motion.div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent"
        />

        <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/15 bg-background/70 px-3.5 py-2 text-xs font-medium text-foreground opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Expand className="h-3.5 w-3.5" />
          View all {images.length} photos
        </span>
      </motion.button>

      {/* Supporting grid: the ten non-cover images as a 2 x 5 grid on desktop. */}
      <motion.ul
        {...railEntrance}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: STAGGER.tight } },
        }}
        className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
      >
        {images.slice(1).map((img, j) => {
          const i = j + 1;
          return (
            <motion.li
              key={img}
              variants={{
                hidden: { opacity: 0, y: 16 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: DURATION.fast, ease: EASE },
                },
              }}
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Open image ${i + 1} of ${images.length}`}
                className={cn(
                  "group relative block aspect-[3/2] w-full cursor-zoom-in overflow-hidden rounded-lg",
                  "border border-border bg-navy transition-colors duration-300 hover:border-primary/50",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                )}
              >
                <Image
                  src={img}
                  alt={`${title}, image ${i + 1} of ${images.length}`}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 33vw, 16vw"
                />
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-primary/0 transition-colors duration-300 group-hover:bg-primary/10"
                />
              </button>
            </motion.li>
          );
        })}
      </motion.ul>

      {/* Lightbox */}
      <AnimatePresence>
        {open && index !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`${title} gallery`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 backdrop-blur-sm"
            onClick={close}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close gallery"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-3 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.25, ease: EASE }}
                className="relative mx-4 h-[75vh] w-[90vw] max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  src={images[index]}
                  alt={`${title}, image ${index + 1} of ${images.length}`}
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium tabular-nums text-white">
              {index + 1} / {images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
