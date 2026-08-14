"use client";

import { DollarSign, Shield, Sailboat } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const features = [
  {
    icon: DollarSign,
    title: "All-Inclusive Pricing",
    description:
      "No hidden fees, no surprises. Every charter includes captain, crew, fuel, and standard amenities. The price you see is the price you pay.",
  },
  {
    icon: Shield,
    title: "Professional Crew",
    description:
      "Every vessel is helmed by a USCG-licensed captain with years of experience on Miami waters. Our crews are trained in hospitality, safety, and seamless service.",
  },
  {
    icon: Sailboat,
    title: "Curated Fleet",
    description:
      "Each yacht in our collection is hand-selected for performance, comfort, and aesthetics. Rigorous maintenance keeps every vessel charter-ready, every time.",
  },
];

export function ExperienceSection() {
  return (
    <Section tone="raised" rules>
      <SectionHeading
        eyebrow="The Difference"
        title="Built on Three Principles"
        accentFrom={2}
        lede="Every charter we run is measured against the same three standards."
      />

      <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <StaggerItem
              key={feature.title}
              as="article"
              className={cn(
                "group flex h-full flex-col rounded-2xl border border-border bg-surface p-8",
                "transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/40"
              )}
            >
              <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary-light transition-colors duration-300 group-hover:bg-primary/20">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {feature.description}
              </p>
            </StaggerItem>
          );
        })}
      </Stagger>
    </Section>
  );
}
