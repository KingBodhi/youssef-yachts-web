"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex min-h-screen items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-[#08080A] via-[#0E0E11] to-[#17171B]"
      )}
    >
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/3 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mb-6 font-body text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
        >
          Miami&rsquo;s Elite Yacht Charter
        </motion.p>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="font-heading text-5xl font-bold leading-tight tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        >
          Miami&rsquo;s Finest Yachts,{" "}
          <span className="text-brand-gradient">One Call Away</span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Premium yacht charters with professional crew. Biscayne Bay, Star
          Island, and the open Atlantic.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/fleet"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8",
              "font-body text-sm font-semibold text-white",
              "shadow-lg shadow-primary/25 hover:bg-primary-light hover:shadow-primary-light/25",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            Explore the Fleet
          </Link>

          <Link
            href="/contact"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-lg border border-primary px-8",
              "font-body text-sm font-semibold text-primary-light",
              "hover:bg-primary/10 hover:text-white",
              "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            )}
          >
            Check Availability
          </Link>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        custom={4}
        variants={fadeUp}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a
          href="#fleet"
          aria-label="Scroll to fleet section"
          className="flex flex-col items-center gap-2 text-muted/60 hover:text-primary-light"
        >
          <span className="text-xs font-medium uppercase tracking-widest">
            Discover
          </span>
          <ChevronDown className="h-5 w-5 animate-scroll-bounce" />
        </a>
      </motion.div>
    </section>
  );
}
