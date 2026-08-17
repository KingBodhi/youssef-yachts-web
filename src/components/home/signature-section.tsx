"use client";

import Link from "next/link";
import Image from "next/image";
import { Sunset, Anchor, PartyPopper, ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const experiences = [
  {
    icon: Sunset,
    title: "Sunset Cruises",
    image: "/yachts/leopard-92/03.jpg",
    description:
      "Head out as the skyline turns gold. A relaxed cruise past Star Island and along the bay, timed to the light.",
  },
  {
    icon: Anchor,
    title: "Sandbar & Island Days",
    image: "/yachts/cantius-45/01.jpg",
    description:
      "Anchor at the sandbar with floats, water toys, and open water. The classic Miami weekend on the bay.",
  },
  {
    icon: PartyPopper,
    title: "Celebrations & Corporate",
    image: "/yachts/leopard-92/04.jpg",
    description:
      "Birthdays, milestones, and client entertaining aboard a private yacht built for a group and a great night.",
  },
];

export function SignatureExperiences() {
  return (
    <Section tone="base">
      <SectionHeading
        eyebrow="On the Water"
        title="Signature Experiences"
        lede="However you want to spend the day, the fleet and crew are built around it."
      />

      <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {experiences.map((exp) => {
          const Icon = exp.icon;
          return (
            <StaggerItem
              key={exp.title}
              as="article"
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-500 hover:border-primary/30"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <Image
                  src={exp.image}
                  alt={`${exp.title} with Hurry Up Slowly Yachts in Miami`}
                  fill
                  className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.06]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/10 to-transparent" />
                <div className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-xl bg-background/70 text-primary-light backdrop-blur-md">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-heading text-xl font-bold text-foreground">
                  {exp.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {exp.description}
                </p>
              </div>
            </StaggerItem>
          );
        })}
      </Stagger>

      <div className="mt-14 text-center">
        <Link
          href="/contact"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-primary-light transition-colors hover:text-white"
        >
          Plan Your Charter
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </Section>
  );
}
