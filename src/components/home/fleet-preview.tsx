"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { getActiveYachts } from "@/lib/data/yachts";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { useEntrance } from "@/lib/use-entrance";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { YachtCard } from "@/components/ui/yacht-card";
import { StaggerItem } from "@/components/ui/reveal";

const NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six",
  "seven", "eight", "nine", "ten", "eleven", "twelve",
];

function spell(n: number): string {
  const word = NUMBER_WORDS[n] ?? String(n);
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function FleetPreview() {
  const activeYachts = getActiveYachts();
  const gridEntrance = useEntrance(0.1);
  const linkEntrance = useEntrance(0.6);

  return (
    <Section id="fleet" tone="base">
      <SectionHeading
        eyebrow="The Collection"
        title="Our Fleet"
        lede={`${spell(
          activeYachts.length
        )} hand-selected vessels, each maintained to the highest standards. From intimate sunset cruises to full-scale celebrations, there is a yacht here for every occasion.`}
      />

      <motion.div
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: STAGGER.base } },
        }}
        {...gridEntrance}
        className="mx-auto mt-16 flex max-w-5xl flex-col gap-6"
      >
        {activeYachts.map((yacht, i) => (
          <StaggerItem key={yacht.id} className="h-full">
            <YachtCard yacht={yacht} index={i} layout="row" />
          </StaggerItem>
        ))}
      </motion.div>

      <motion.div
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: { duration: DURATION.base, ease: EASE },
          },
        }}
        {...linkEntrance}
        className="mt-14 text-center"
      >
        <Link
          href="/fleet"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-light transition-colors hover:text-white"
        >
          View the Full Fleet
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </Section>
  );
}
