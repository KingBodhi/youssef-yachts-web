"use client";

import { useReducedMotion } from "framer-motion";
import { VIEWPORT } from "@/lib/motion";

/**
 * Entrance props for any element that reveals on scroll.
 *
 * The important half is the reduced-motion branch. Reveals are driven by
 * `whileInView`, which means an element sits at `opacity: 0` until an
 * IntersectionObserver callback promotes it. Anyone who never receives that
 * callback sees nothing at all, and a "no animation" preference should never
 * cost someone the content. So when reduced motion is requested we skip the
 * observer entirely and render at the final state on mount.
 *
 * This is deliberately centralised: the same defect appeared independently in
 * the section headings, the card grids and the check lists, which is the
 * signature of a missing shared primitive rather than three separate mistakes.
 */
export function useEntrance(
  amount: number = VIEWPORT.amount,
  once = true
) {
  const reduce = useReducedMotion();

  if (reduce) {
    return { initial: "visible", animate: "visible" } as const;
  }

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once, amount },
  } as const;
}
