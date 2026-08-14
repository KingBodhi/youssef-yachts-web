import type { Variants, Transition } from "framer-motion";

/**
 * Single source of truth for motion across the site.
 *
 * Every page previously declared its own `fadeUp` / `stagger` with slightly
 * different easings and durations, which is why sections felt subtly out of
 * step with one another. Import from here instead of redeclaring locally.
 */

/** The house easing curve. Fast out, long settle. */
export const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/** Secondary curve for small, snappy UI moves (chips, toggles, icons). */
export const EASE_SNAP = [0.4, 0, 0.2, 1] as [number, number, number, number];

export const DURATION = {
  fast: 0.35,
  base: 0.6,
  slow: 0.8,
  glacial: 1.2,
} as const;

export const STAGGER = {
  tight: 0.06,
  base: 0.1,
  loose: 0.16,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 300,
  damping: 26,
  mass: 0.6,
};

/** Standard viewport trigger so every section fires at the same scroll depth. */
export const VIEWPORT = { once: true, amount: 0.2 } as const;
export const VIEWPORT_LOOSE = { once: true, amount: 0.1 } as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.slow, ease: EASE } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE },
  },
};

/** Indexed variant for lists that animate by `custom={i}`. */
export const fadeUpIndexed: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, delay: i * STAGGER.base, ease: EASE },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.base } },
};

export const staggerContainerTight: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER.tight } },
};

/** Word-by-word heading reveal. Pair with <TextReveal />. */
export const wordContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.05 } },
};

export const wordChild: Variants = {
  hidden: { opacity: 0, y: "0.6em" },
  visible: {
    opacity: 1,
    y: "0em",
    transition: { duration: 0.7, ease: EASE },
  },
};
