"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export function CtaSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="relative overflow-hidden">
      {/* Onyx gradient background */}
      <div className="absolute inset-0 bg-brand-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.06),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-sm font-medium uppercase tracking-[0.25em] text-white/70"
        >
          Your Next Adventure Awaits
        </motion.p>

        <motion.h2
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-3 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
        >
          Ready to Set Sail?
        </motion.h2>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-white/80"
        >
          Whether it&rsquo;s a sunset cruise, a celebration, or a corporate
          event, our team will craft the perfect charter experience for you.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Link
            href="/contact"
            className={cn(
              "inline-flex h-12 items-center justify-center rounded-lg bg-white px-8",
              "text-sm font-semibold text-[#0A0A0B]",
              "shadow-lg shadow-black/20 hover:bg-white/90",
              "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            )}
          >
            Book Now
          </Link>

          <a
            href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}
            className={cn(
              "inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/30 px-8",
              "text-sm font-semibold text-white",
              "hover:bg-white/10",
              "focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
            )}
          >
            <Phone className="h-4 w-4" />
            {BRAND.phone}
          </a>
        </motion.div>
      </div>
    </section>
  );
}
