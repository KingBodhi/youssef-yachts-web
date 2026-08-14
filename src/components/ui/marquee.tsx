"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  items: readonly string[];
  /** Seconds for one full pass. Higher is slower. */
  speed?: number;
  className?: string;
  reverse?: boolean;
}

/**
 * Continuous horizontal ticker. The track is duplicated once and translated by
 * exactly 50 percent, so the loop is seamless rather than snapping at the end.
 * Falls back to a static, wrapped list when reduced motion is requested.
 */
export function Marquee({
  items,
  speed = 42,
  className,
  reverse = false,
}: MarqueeProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <div
        className={cn(
          "flex flex-wrap items-center justify-center gap-x-8 gap-y-3",
          className
        )}
      >
        {items.map((item) => (
          <span key={item} className="marquee-item">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn("marquee group relative overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="marquee-track"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="marquee-group">
            {items.map((item) => (
              <span key={`${copy}-${item}`} className="marquee-item">
                {item}
                <span className="marquee-dot" />
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Edge fades so the ticker dissolves into the section rather than clipping. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}
