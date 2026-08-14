"use client";

import { useRef } from "react";
import Link from "next/link";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { DURATION, EASE } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { TextReveal } from "@/components/ui/text-reveal";

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, delay: i * 0.12, ease: EASE },
  }),
};

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();

  // Scroll-linked parallax: the media layer drifts slower than the content,
  // and the content fades out before the next section arrives.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "22%"]);
  const mediaScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.1]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", reduce ? "0%" : "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);

  return (
    <section
      ref={ref}
      className={cn(
        "relative flex min-h-[100svh] items-center justify-center overflow-hidden",
        "bg-gradient-to-br from-[#08080A] via-[#0E0E11] to-[#17171B]"
      )}
    >
      {/* Background drone video: parallax plus a very slow ken burns drift. */}
      <motion.div
        style={{ y: mediaY, scale: mediaScale }}
        className="absolute inset-0 h-[120%] w-full will-change-transform"
      >
        <video
          className={cn(
            "pointer-events-none absolute inset-0 h-full w-full object-cover",
            !reduce && "animate-kenburns"
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/video/hero-poster.jpg"
          aria-hidden="true"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Legibility scrim. A single gradient stack, no hard banding. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#08080A]/75 via-[#08080A]/45 to-[#08080A]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(8,8,10,0.6)_100%)]"
      />
      <div
        aria-hidden="true"
        className="hairline pointer-events-none absolute inset-x-0 bottom-0 h-px"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-4xl px-6 text-center"
      >
        <motion.p
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6 flex items-center justify-center gap-3 font-body text-xs font-medium uppercase tracking-[0.3em] text-primary-light sm:text-sm"
        >
          <span className="animate-pulse-line h-px w-8 bg-primary-light/50" />
          Miami&rsquo;s Elite Yacht Charter
          <span className="animate-pulse-line h-px w-8 bg-primary-light/50" />
        </motion.p>

        <TextReveal
          as="h1"
          immediate
          delay={0.2}
          text="Miami's Finest Yachts, One Call Away"
          accentFrom={3}
          className="font-heading text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl"
        />

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
        >
          Premium yacht charters with professional crew. Biscayne Bay, Star
          Island, and the open Atlantic.
        </motion.p>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
        >
          <Button asChild size="lg">
            <Link href="/fleet">Explore the Fleet</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/contact">Check Availability</Link>
          </Button>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <motion.a
          href="#fleet"
          aria-label="Scroll to the fleet"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: DURATION.base, delay: 0.9, ease: EASE }}
          className="flex flex-col items-center gap-2 text-muted/60 transition-colors hover:text-primary-light"
        >
          <span className="text-[11px] font-medium uppercase tracking-[0.3em]">
            Discover
          </span>
          <ChevronDown className="animate-scroll-bounce h-5 w-5" />
        </motion.a>
      </motion.div>
    </section>
  );
}
