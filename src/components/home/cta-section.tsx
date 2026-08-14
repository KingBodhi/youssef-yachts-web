"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { DURATION, EASE } from "@/lib/motion";
import { useEntrance } from "@/lib/use-entrance";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, delay: i * 0.12, ease: EASE },
  }),
};

export function CtaSection() {
  const entrance = useEntrance(0.5);

  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="absolute inset-0 bg-brand-gradient" />
      <div
        aria-hidden="true"
        className="animate-gradient-pan absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.07),transparent_60%)]"
      />
      <div aria-hidden="true" className="hairline absolute inset-x-0 top-0 h-px" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24 text-center sm:py-32 lg:px-8">
        <motion.p
          custom={0}
          variants={fadeUp}
          {...entrance}
          className="flex items-center justify-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-white/70 sm:text-sm"
        >
          <span className="animate-pulse-line h-px w-8 bg-white/40" />
          Your Next Adventure Awaits
          <span className="animate-pulse-line h-px w-8 bg-white/40" />
        </motion.p>

        <TextReveal
          as="h2"
          text="Ready to Set Sail?"
          delay={0.08}
          className="mt-4 font-heading text-4xl font-bold tracking-tight text-white sm:text-5xl"
        />

        <motion.p
          custom={2}
          variants={fadeUp}
          {...entrance}
          className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-white/80"
        >
          A sunset cruise, a celebration, or a corporate charter. Tell us the
          occasion and our team will build the day around it.
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          {...entrance}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg">
            <Link href="/contact">Book Now</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`tel:${BRAND.phone.replace(/[^+\d]/g, "")}`}>
              <Phone className="h-4 w-4" />
              {BRAND.phone}
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
