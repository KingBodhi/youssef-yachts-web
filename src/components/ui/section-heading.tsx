"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";
import { TextReveal } from "@/components/ui/text-reveal";

interface SectionHeadingProps {
  /** Small spaced-caps label above the title. */
  eyebrow: string;
  title: string;
  /** Word index from which the title switches to the gradient treatment. */
  accentFrom?: number;
  lede?: ReactNode;
  align?: "center" | "left";
  as?: "h1" | "h2";
  className?: string;
  /** Larger type for page-level headings. */
  size?: "section" | "page";
}

/**
 * The single heading treatment used by every section on every page: spaced-caps
 * eyebrow between two hairlines, word-revealed title, optional lede.
 */
export function SectionHeading({
  eyebrow,
  title,
  accentFrom,
  lede,
  align = "center",
  as = "h2",
  className,
  size = "section",
}: SectionHeadingProps) {
  const centered = align === "center";
  const reduce = useReducedMotion();

  // Reduced motion renders at the final state rather than waiting on an
  // intersection callback, so the copy is never withheld.
  const rise = (delay: number) =>
    reduce
      ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: DURATION.base, delay, ease: EASE },
        };

  return (
    <div
      className={cn(
        centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl text-left",
        className
      )}
    >
      <motion.p
        {...rise(0)}
        className={cn(
          "flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-primary-light sm:text-sm",
          centered && "justify-center"
        )}
      >
        <span className="h-px w-8 bg-primary-light/40 animate-pulse-line" />
        {eyebrow}
        <span className="h-px w-8 bg-primary-light/40 animate-pulse-line" />
      </motion.p>

      <TextReveal
        as={as}
        text={title}
        accentFrom={accentFrom}
        delay={0.05}
        className={cn(
          "mt-4 font-heading font-bold tracking-tight text-foreground",
          size === "page"
            ? "text-4xl sm:text-5xl lg:text-6xl"
            : "text-3xl sm:text-4xl lg:text-5xl"
        )}
      />

      {lede && (
        <motion.p
          {...rise(0.15)}
          className={cn(
            "mt-5 text-base leading-relaxed text-muted sm:text-lg",
            centered && "mx-auto"
          )}
        >
          {lede}
        </motion.p>
      )}
    </div>
  );
}
