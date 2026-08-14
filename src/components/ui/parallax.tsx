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
  scrim = 0.55,
  children,
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y: MotionValue<string> = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? ["0%", "0%"] : [`${-strength}%`, `${strength}%`]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [1, 1, 1] : [1.16, 1.06, 1.16]
  );

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)}>
      <motion.div
        style={{ y, scale }}
        className="absolute inset-[-12%] will-change-transform"
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
