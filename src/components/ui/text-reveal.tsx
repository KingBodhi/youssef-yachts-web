"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { wordChild, wordContainer } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  /** Plain text. Split on spaces and revealed word by word. */
  text: string;
  className?: string;
  /** Words from this index onward render inside the accent gradient. */
  accentFrom?: number;
  as?: "h1" | "h2" | "h3" | "p";
  delay?: number;
  /** Animate on mount instead of on scroll. Use for above-the-fold headings. */
  immediate?: boolean;
  children?: ReactNode;
}

/**
 * Word-by-word masked heading reveal. Each word sits in an overflow-hidden
 * span and rises into place, which reads as deliberate rather than bouncy.
 */
export function TextReveal({
  text,
  className,
  accentFrom,
  as = "h2",
  delay = 0,
  immediate = false,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const MotionTag = motion[as];

  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const activation = immediate
    ? { animate: "visible" as const }
    : { whileInView: "visible" as const, viewport: { once: true, amount: 0.5 } };

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.045, delayChildren: delay },
        },
      }}
      initial="hidden"
      {...activation}
      aria-label={text}
    >
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden whitespace-pre align-bottom"
          aria-hidden="true"
        >
          <motion.span
            variants={wordChild}
            className={cn(
              "inline-block whitespace-pre",
              accentFrom !== undefined && i >= accentFrom && "text-brand-gradient"
            )}
          >
            {i < words.length - 1 ? `${word} ` : word}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

export { wordContainer };
