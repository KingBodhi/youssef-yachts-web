"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { DURATION, EASE } from "@/lib/motion";
import { TextReveal } from "@/components/ui/text-reveal";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  /** Word index from which the title switches to the gradient treatment. */
  accentFrom?: number;
  lede?: ReactNode;
  children?: ReactNode;
  className?: string;
}

/**
 * The masthead for every inner page. About, FAQ, Contact and Fleet each had a
 * different hero height, gutter and eyebrow before this; now they are one
 * component, so navigating between them no longer shifts the layout.
 */
export function PageHero({
  eyebrow,
  title,
  accentFrom,
  lede,
  children,
  className,
}: PageHeroProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-18%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, reduce ? 1 : 0.15]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex items-center justify-center overflow-hidden",
        "bg-gradient-to-b from-navy via-background to-background",
        "pt-32 pb-16 sm:pt-40 sm:pb-20",
        className
      )}
    >
      {/* Ambient light pools. Purely decorative. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="animate-float-slow absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/[0.06] blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[380px] w-[380px] rounded-full bg-primary-dark/[0.05] blur-3xl" />
      </div>

      <motion.div
        style={{ y, opacity }}
        className="relative mx-auto max-w-3xl px-6 text-center lg:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-primary-light sm:text-sm"
        >
          <span className="animate-pulse-line h-px w-8 bg-primary-light/40" />
          {eyebrow}
          <span className="animate-pulse-line h-px w-8 bg-primary-light/40" />
        </motion.p>

        <TextReveal
          as="h1"
          immediate
          text={title}
          accentFrom={accentFrom}
          delay={0.1}
          className="mt-5 font-heading text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
        />

        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, delay: 0.35, ease: EASE }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {lede}
          </motion.p>
        )}

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: DURATION.base, delay: 0.5, ease: EASE }}
            className="mt-10"
          >
            {children}
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}
