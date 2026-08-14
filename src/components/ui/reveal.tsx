"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ElementType, ReactNode } from "react";
import { DURATION, EASE, STAGGER, VIEWPORT } from "@/lib/motion";
import { useEntrance } from "@/lib/use-entrance";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** direction the element travels from */
  from?: Direction;
  /** seconds of delay before the reveal starts */
  delay?: number;
  /** travel distance in px */
  distance?: number;
  /** viewport amount (0-1) that must be visible to trigger */
  amount?: number;
  /** render as a different element if needed */
  as?: "div" | "section" | "li" | "article" | "header" | "aside";
  once?: boolean;
}

const offset = (dir: Direction, d: number) => {
  switch (dir) {
    case "up":
      return { y: d };
    case "down":
      return { y: -d };
    case "left":
      return { x: d };
    case "right":
      return { x: -d };
    default:
      return {};
  }
};

export function Reveal({
  children,
  className,
  from = "up",
  delay = 0,
  distance = 28,
  amount = VIEWPORT.amount,
  as = "div",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();
  const entrance = useEntrance(amount, once);
  const MotionTag = motion[as] as typeof motion.div;

  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, ...offset(from, distance) },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: DURATION.slow, delay, ease: EASE },
    },
  };

  return (
    <MotionTag className={className} variants={variants} {...entrance}>
      {children}
    </MotionTag>
  );
}

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** seconds between each child */
  gap?: number;
  delay?: number;
  amount?: number;
  as?: ElementType;
  once?: boolean;
}

/**
 * Parent for a group of <StaggerItem /> children. Keeps list entrances
 * identical everywhere instead of each page inventing its own container.
 */
export function Stagger({
  children,
  className,
  gap = STAGGER.base,
  delay = 0,
  amount = VIEWPORT.amount,
  as = "div",
  once = true,
}: StaggerProps) {
  const MotionTag = motion[as as "div"];
  const entrance = useEntrance(amount, once);

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: gap, delayChildren: delay } },
      }}
      {...entrance}
    >
      {children}
    </MotionTag>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
  from?: Direction;
  distance?: number;
  as?: ElementType;
}

export function StaggerItem({
  children,
  className,
  from = "up",
  distance = 24,
  as = "div",
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as as "div"];

  return (
    <MotionTag
      className={className}
      variants={{
        hidden: reduce
          ? { opacity: 0 }
          : { opacity: 0, ...offset(from, distance) },
        visible: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration: DURATION.base, ease: EASE },
        },
      }}
    >
      {children}
    </MotionTag>
  );
}
