"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Anchor } from "lucide-react";
import { getActiveYachts } from "@/lib/data/yachts";
import { cn } from "@/lib/utils";
import { EASE, DURATION, STAGGER } from "@/lib/motion";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { YachtCard } from "@/components/ui/yacht-card";

type SizeFilter = "all" | "under-70" | "70-90" | "90-plus";

const SIZE_FILTERS: { id: SizeFilter; label: string }[] = [
  { id: "all", label: "All Yachts" },
  { id: "under-70", label: "Under 70 ft" },
  { id: "70-90", label: "70 to 90 ft" },
  { id: "90-plus", label: "90 ft and up" },
];

function matchesSize(length: number, filter: SizeFilter): boolean {
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

export function FleetClient() {
  const [activeFilter, setActiveFilter] = useState<SizeFilter>("all");
  const allYachts = useMemo(() => getActiveYachts(), []);

  const filtered = useMemo(
    () => allYachts.filter((y) => matchesSize(y.length, activeFilter)),
    [allYachts, activeFilter]
  );

  // Counts sit on the filter chips so an empty result is never a surprise.
  const counts = useMemo(() => {
    const map = {} as Record<SizeFilter, number>;
    for (const f of SIZE_FILTERS) {
      map[f.id] = allYachts.filter((y) => matchesSize(y.length, f.id)).length;
    }
    return map;
  }, [allYachts]);

  return (
    <>
      <PageHero
        eyebrow="The Collection"
        title="Our Fleet"
        accentFrom={1}
        lede="Handpicked vessels for unforgettable days on Miami's water. Every yacht is maintained to the same standard and documented with the same detail, so comparing them is straightforward."
      />

      <Section space="tight" className="pt-0">
        <div
          role="group"
          aria-label="Filter the fleet by length"
          className="mb-14 flex flex-wrap items-center justify-center gap-3"
        >
          {SIZE_FILTERS.map((filter, i) => {
            const isActive = activeFilter === filter.id;
            return (
              <motion.button
                key={filter.id}
                type="button"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: DURATION.base,
                  delay: 0.05 * i,
                  ease: EASE,
                }}
                onClick={() => setActiveFilter(filter.id)}
                aria-pressed={isActive}
                className={cn(
                  "relative rounded-full px-6 py-2.5 text-sm font-medium transition-colors duration-300",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isActive
                    ? "text-[#0A0A0B]"
                    : "border border-border bg-surface text-muted hover:border-primary/40 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="fleet-filter-pill"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-black/30"
                  />
                )}
                <span className="relative z-10">
                  {filter.label}
                  <span
                    className={cn(
                      "ml-2 text-xs tabular-nums",
                      isActive ? "text-[#0A0A0B]/60" : "text-muted/60"
                    )}
                  >
                    {counts[filter.id]}
                  </span>
                </span>
              </motion.button>
            );
          })}
        </div>

        <motion.div
          layout
          className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((yacht, i) => (
              <motion.div
                key={yacht.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: DURATION.base,
                    delay: i * STAGGER.tight,
                    ease: EASE,
                  },
                }}
                exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
              >
                <YachtCard yacht={yacht} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-20 text-center"
          >
            <Anchor className="mx-auto h-12 w-12 text-muted/50" />
            <p className="mt-4 text-lg text-muted">
              No yachts fall in this length range. Choose another filter.
            </p>
          </motion.div>
        )}
      </Section>
    </>
  );
}
