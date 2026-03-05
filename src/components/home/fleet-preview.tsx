"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { Users, Ruler, ArrowRight } from "lucide-react";
import { yachts } from "@/lib/data/yachts";
import { formatCurrency, cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
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

export function FleetPreview() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const activeYachts = yachts.filter((y) => y.status === "active");

  return (
    <section
      ref={ref}
      id="fleet"
      className="relative bg-background py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
            The Collection
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Our Fleet
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-muted">
            Five hand-selected vessels, each maintained to the highest
            standards. From intimate sunset cruises to full-scale celebrations,
            there is a perfect yacht for every occasion.
          </p>
        </motion.div>

        {/* Yacht cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {activeYachts.map((yacht) => (
            <motion.div key={yacht.id} variants={cardVariants}>
              <Link
                href={`/fleet/${yacht.slug}`}
                className={cn(
                  "group block overflow-hidden rounded-2xl border border-border bg-surface",
                  "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                )}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                  <Image
                    src={yacht.heroImage}
                    alt={yacht.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Price badge */}
                  <div className="absolute right-3 top-3 rounded-lg bg-background/80 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-sm font-semibold text-primary-light">
                      From {formatCurrency(yacht.pricing.halfDay)}
                    </span>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-primary/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-foreground transition-colors group-hover:text-primary-light">
                    {yacht.name}
                  </h3>
                  <p className="mt-1 text-sm text-muted">{yacht.tagline}</p>

                  {/* Specs */}
                  <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
                    <div className="flex items-center gap-1.5 text-sm text-muted">
                      <Ruler className="h-4 w-4 text-primary/60" />
                      <span>{yacht.length} ft</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-muted">
                      <Users className="h-4 w-4 text-primary/60" />
                      <span>{yacht.capacity} guests</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View all link */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-12 text-center"
        >
          <Link
            href="/fleet"
            className={cn(
              "inline-flex items-center gap-2 text-sm font-semibold text-primary-light",
              "hover:text-primary transition-colors"
            )}
          >
            View the Full Fleet
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
