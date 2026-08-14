import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "base" | "raised" | "deep";
type Space = "base" | "tight" | "loose";

const toneClasses: Record<Tone, string> = {
  base: "bg-background",
  raised: "bg-navy",
  deep: "bg-[#050507]",
};

const spaceClasses: Record<Space, string> = {
  tight: "py-16 sm:py-20",
  base: "py-24 sm:py-32",
  loose: "py-32 sm:py-40",
};

interface SectionProps {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  id?: string;
  tone?: Tone;
  space?: Space;
  /** Draw the hairline gradient rules at the top and bottom edges. */
  rules?: boolean;
  /** Skip the inner max-width container for full-bleed content. */
  bleed?: boolean;
}

/**
 * The one section wrapper. Every page-level band uses this so vertical rhythm,
 * gutters, and max width are identical from the homepage through to /contact.
 */
export function Section({
  children,
  className,
  innerClassName,
  id,
  tone = "base",
  space = "base",
  rules = false,
  bleed = false,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        toneClasses[tone],
        spaceClasses[space],
        className
      )}
    >
      {rules && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      )}

      {bleed ? (
        children
      ) : (
        <div className={cn("mx-auto max-w-7xl px-6 lg:px-8", innerClassName)}>
          {children}
        </div>
      )}

      {rules && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      )}
    </section>
  );
}
