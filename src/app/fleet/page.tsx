"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Anchor, Users, Ruler } from "lucide-react";
import { yachts } from "@/lib/data/yachts";
import { formatCurrency, cn } from "@/lib/utils";

type SizeFilter = "all" | "under-70" | "70-90" | "90-plus";

const SIZE_FILTERS: { id: SizeFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "under-70", label: "Under 70'" },
  { id: "70-90", label: "70-90'" },
  { id: "90-plus", label: "90'+" },
];

function filterBySize(length: number, filter: SizeFilter): boolean {
  switch (filter) {
    case "under-70":
      return length < 70;
    case "70-90":
      return length >= 70 && length <= 90;
    case "90-plus":
      return length > 90;
    default:
      return true;
  }
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export default function FleetPage() {
  const [activeFilter, setActiveFilter] = useState<SizeFilter>("all");

  const filteredYachts = yachts.filter(
    (y) => y.status === "active" && filterBySize(y.length, activeFilter)
  );

  return (
    <section className="min-h-screen pb-24 pt-32">
      {/* Header */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h1 className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Our <span className="text-brand-gradient">Fleet</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted">
            Handpicked luxury vessels for unforgettable experiences on Miami's
            waters. Every yacht in our fleet is maintained to the highest
            standards.
          </p>
        </motion.div>

        {/* Size Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12 flex flex-wrap items-center justify-center gap-3"
        >
          {SIZE_FILTERS.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200",
                activeFilter === filter.id
                  ? "bg-primary text-[#0A0A0B] shadow-lg shadow-primary/25"
                  : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </motion.div>

        {/* Yacht Card Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {filteredYachts.map((yacht) => (
              <motion.div key={yacht.id} variants={cardVariants} layout>
                <Link
                  href={`/fleet/${yacht.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
                >
                  {/* Image Placeholder */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                    <Image
                      src={yacht.heroImage}
                      alt={yacht.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Price Badge */}
                    <div className="absolute right-4 top-4 rounded-full bg-primary px-4 py-1.5 text-sm font-semibold text-[#0A0A0B] shadow-lg">
                      From {formatCurrency(yacht.pricing.halfDay)}
                    </div>

                    {/* Gradient overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>

                  {/* Card Body */}
                  <div className="p-6">
                    <h3 className="font-heading text-xl font-semibold text-foreground transition-colors group-hover:text-primary-light">
                      {yacht.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{yacht.tagline}</p>

                    {/* Specs Row */}
                    <div className="mt-4 flex items-center gap-6 border-t border-border pt-4">
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Ruler className="h-4 w-4 text-primary" />
                        <span>{yacht.length}&apos; ft</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted">
                        <Users className="h-4 w-4 text-primary" />
                        <span>Up to {yacht.capacity}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {filteredYachts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <Anchor className="mx-auto h-12 w-12 text-muted/50" />
            <p className="mt-4 text-lg text-muted">
              No yachts match this size range. Try a different filter.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
