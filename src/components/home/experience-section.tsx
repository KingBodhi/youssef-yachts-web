"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { DollarSign, Shield, Sailboat } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: DollarSign,
    title: "All-Inclusive Pricing",
    description:
      "No hidden fees, no surprises. Every charter includes captain, crew, fuel, and standard amenities. The price you see is the price you pay.",
  },
  {
    icon: Shield,
    title: "Professional Crew",
    description:
      "Every vessel is helmed by a USCG-licensed captain with years of experience on Miami waters. Our crews are trained in hospitality, safety, and seamless service.",
  },
  {
    icon: Sailboat,
    title: "Curated Fleet",
    description:
      "Each yacht in our collection is hand-selected for performance, comfort, and aesthetics. Rigorous maintenance ensures every vessel is charter-ready, every time.",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.2 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function ExperienceSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="relative bg-navy py-24 sm:py-32"
    >
      {/* Subtle top border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
            The Hurry Up Slowly Difference
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Why Hurry Up Slowly
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            We built our reputation on three principles that guide every charter.
          </p>
        </motion.div>

        {/* Feature cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={cn(
                  "group rounded-2xl border border-border bg-surface p-8",
                  "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
              >
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary-light" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Subtle bottom border */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
    </section>
  );
}
