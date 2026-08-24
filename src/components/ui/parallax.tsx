"use client";

import { useRef, type ReactNode } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** Percentage of travel across the full scroll of the element. */
  strength?: number;
  direction?: "up" | "down";
}

/** Wraps any content and drifts it against the scroll direction. */
export function Parallax({
  children,
  className,
  strength = 12,
  direction = "up",
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const sign = direction === "up" ? -1 : 1;
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`${-sign * strength}%`, `${sign * strength}%`]
  );

  return (
    <div ref={ref} className={cn("relative", className)}>
      <motion.div style={{ y }} className="h-full w-full will-change-transform">
        {children}
      </motion.div>
    </div>
  );
}

interface ParallaxImageProps {
  src: string;
  alt: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
  priority?: boolean;
  strength?: number;
  /**
   * Overall parallax movement + zoom, 0 to 1. 1 is the full cinematic drift
   * used on wide atmospheric bands. Lower it for a band whose subject fills the
   * frame (a whole boat), so object-cover does not have to zoom past the edges
   * and clip the top. The inset, travel and scale all scale together, so
   * coverage during the drift stays gap-free at any value.
   */
  intensity?: number;
  /** Overlay children rendered above the image and scrim. */
  children?: ReactNode;
  /** Darkening scrim strength, 0 to 1. */
  scrim?: number;
}

/**
 * Full-bleed image band whose photograph drifts and scales as it passes the
 * viewport. The scrim is a real gradient rather than stacked translucent
 * blocks, so there is no visible banding across the photograph.
 */
export function ParallaxImage({
  src,
  alt,
  className,
  imageClassName,
  sizes = "100vw",
  priority = false,
  strength = 14,
  intensity = 1,
  scrim = 0.55,
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Everything scales by `intensity` in lockstep so the moving image always
  // covers the frame: a smaller inset needs proportionally less travel and zoom.
  const travel = strength * intensity;
  const insetPct = -12 * intensity;
  const scalePeak = 1 + 0.16 * intensity;
  const scaleMid = 1 + 0.06 * intensity;
  const y: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`${-travel}%`, `${travel}%`]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [scalePeak, scaleMid, scalePeak]
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y, scale, inset: `${insetPct}%` }}
        className="absolute will-change-transform"
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          className={cn("object-cover", imageClassName)}
        />
      </motion.div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, rgba(8,8,10,${Math.min(
            scrim + 0.35,
            0.96
          )}) 0%, rgba(8,8,10,${scrim}) 45%, rgba(8,8,10,${Math.max(
            scrim - 0.3,
            0.12
          )}) 100%)`,
        }}
      />

      {children && <div className="relative z-10 h-full w-full">{children}</div>}
    </div>
  );
}
