"use client";

import { motion } from "framer-motion";
import { ParallaxImage } from "@/components/ui/parallax";
import { CountUp } from "@/components/ui/count-up";
import { Stagger, StaggerItem } from "@/components/ui/reveal";
import { DURATION, EASE } from "@/lib/motion";
import { useEntrance } from "@/lib/use-entrance";
import { getActiveYachts } from "@/lib/data/yachts";

export function ShowcaseSection() {
  const quoteEntrance = useEntrance(0.4);
  const fleet = getActiveYachts();
  const largest = Math.max(...fleet.map((y) => y.length));
  const maxGuests = Math.max(...fleet.map((y) => y.capacity));

  const stats = [
    { value: fleet.length, suffix: "", label: "Vessels in the fleet" },
    { value: largest, suffix: " ft", label: "Longest yacht available" },
    { value: maxGuests, suffix: "", label: "Guests on a single charter" },
    { value: 7, suffix: " days", label: "Charter availability each week" },
  ];

  return (
    <section className="relative">
      <ParallaxImage
        src="/yachts/leopard-82/11.jpg"
        alt="Golden hour on the water aboard a Hurry Up Slowly yacht"
        sizes="100vw"
        scrim={0.6}
        className="min-h-[560px] py-24 sm:min-h-[640px] sm:py-32"
      >
        <div className="mx-auto flex h-full max-w-7xl flex-col justify-center px-6 lg:px-8">
          <motion.blockquote
            variants={{
              hidden: { opacity: 0, y: 24 },
              visible: {
                opacity: 1,
                y: 0,
                transition: { duration: DURATION.slow, ease: EASE },
              },
            }}
            {...quoteEntrance}
            className="max-w-2xl"
          >
            <p className="font-heading text-3xl font-bold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
              The water does not care how busy your week was.
            </p>
            <footer className="mt-5 text-sm uppercase tracking-[0.3em] text-white/60">
              Hurry Up Slowly
            </footer>
          </motion.blockquote>

          <Stagger
            gap={0.12}
            className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-white/15 pt-10 lg:grid-cols-4"
          >
            {stats.map((stat) => (
              <StaggerItem key={stat.label}>
                <p className="font-heading text-4xl font-bold text-white sm:text-5xl">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60 sm:text-sm sm:tracking-[0.16em]">
                  {stat.label}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </ParallaxImage>
    </section>
  );
}
