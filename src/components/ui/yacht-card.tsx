"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Ruler, Users } from "lucide-react";
import type { Yacht } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { spring } from "@/lib/motion";

interface YachtCardProps {
  yacht: Yacht;
  /** Index within the grid, used for the image priority hint. */
  index?: number;
  className?: string;
}

/**
 * The only yacht card in the app. Deliberately presentational: entrance
 * animation belongs to whichever grid renders it, so the homepage stagger and
 * the fleet page filter transition never fight over the same element.
 *
 * The homepage grid and the fleet page used to ship two near-identical cards that disagreed on the price badge, the spec
 * labels, and the hover treatment. One component removes that class of drift.
 */
export function YachtCard({ yacht, index = 0, className }: YachtCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.article
      whileHover={reduce ? undefined : { y: -8 }}
      transition={spring}
      className={cn("h-full", className)}
    >
      <Link
        href={`/fleet/${yacht.slug}`}
        className={cn(
          "sheen-parent group flex h-full flex-col overflow-hidden rounded-2xl",
          "border border-border bg-surface",
          "transition-colors duration-500 hover:border-primary/40",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        )}
      >
        <div className="relative aspect-[3/2] overflow-hidden bg-navy">
          <Image
            src={yacht.thumbnail}
            alt={`${yacht.name}, ${yacht.tagline}`}
            fill
            priority={index < 3}
            className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.08]"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />

          <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-primary-light backdrop-blur-md">
            {yacht.builder}
          </span>

          <span className="absolute right-4 top-4 rounded-full border border-white/15 bg-background/70 px-3 py-1 text-xs font-semibold text-primary-light backdrop-blur-md">
            From {formatCurrency(yacht.pricing.halfDay)}
          </span>

          <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center gap-2 bg-primary/90 py-3 text-sm font-semibold text-[#0A0A0B] transition-transform duration-500 ease-out group-hover:translate-y-0">
            View Details
            <ArrowRight className="h-4 w-4" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-6">
          <h3 className="font-heading text-xl font-bold text-foreground transition-colors duration-300 group-hover:text-primary-light">
            {yacht.name}
          </h3>
          <p className="mt-1 text-sm text-muted">{yacht.tagline}</p>

          <div className="mt-auto flex items-center gap-6 border-t border-border pt-4 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Ruler className="h-4 w-4 text-primary/60" />
              {yacht.length} ft
            </span>
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary/60" />
              Up to {yacht.capacity} guests
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
