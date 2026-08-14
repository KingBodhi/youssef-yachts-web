"use client";

import Link from "next/link";
import * as Tabs from "@radix-ui/react-tabs";
import { motion } from "framer-motion";
import {
  Anchor,
  ArrowLeft,
  BedDouble,
  Calendar,
  CheckCircle2,
  Clock,
  Gauge,
  Moon,
  Ruler,
  Sun,
  UserCheck,
  Users,
  Waves,
} from "lucide-react";
import type { Yacht } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { DURATION, EASE, STAGGER } from "@/lib/motion";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { Gallery } from "@/components/ui/gallery";
import { Button } from "@/components/ui/button";

interface YachtDetailClientProps {
  yacht: Yacht;
}

const SPEC_META: Record<
  string,
  { label: string; icon: React.ReactNode }
> = {
  length: { label: "Length", icon: <Ruler className="h-5 w-5 text-primary" /> },
  beam: { label: "Beam", icon: <Ruler className="h-5 w-5 text-primary" /> },
  draft: { label: "Draft", icon: <Anchor className="h-5 w-5 text-primary" /> },
  speed: { label: "Top Speed", icon: <Gauge className="h-5 w-5 text-primary" /> },
  fuelCapacity: {
    label: "Fuel Capacity",
    icon: <Anchor className="h-5 w-5 text-primary" />,
  },
  waterCapacity: {
    label: "Water Capacity",
    icon: <Waves className="h-5 w-5 text-primary" />,
  },
};

const TABS = [
  { value: "overview", label: "Overview" },
  { value: "amenities", label: "Amenities" },
  { value: "specs", label: "Specifications" },
  { value: "pricing", label: "Pricing" },
] as const;

function CheckList({ items }: { items: string[] }) {
  return (
    <Stagger as="ul" gap={STAGGER.tight} className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <StaggerItem key={item} as="li" className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <span className="text-sm text-muted">{item}</span>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

export function YachtDetailClient({ yacht }: YachtDetailClientProps) {
  const headline = [
    { icon: <Ruler className="h-5 w-5" />, label: "Length", node: <CountUp value={yacht.length} suffix="'" /> },
    { icon: <Users className="h-5 w-5" />, label: "Capacity", node: <><CountUp value={yacht.capacity} /> guests</> },
    { icon: <BedDouble className="h-5 w-5" />, label: "Cabins", node: <CountUp value={yacht.cabins} /> },
    { icon: <UserCheck className="h-5 w-5" />, label: "Crew", node: <CountUp value={yacht.crew} /> },
    { icon: <Calendar className="h-5 w-5" />, label: "Year", node: <>{yacht.year}</> },
  ];

  const priceTiers = [
    {
      key: "half",
      icon: <Sun className="h-5 w-5 text-primary" />,
      title: "Half-Day",
      meta: "4 Hours",
      amount: yacht.pricing.halfDay,
      note: null as string | null,
      featured: false,
    },
    {
      key: "full",
      icon: <Clock className="h-5 w-5 text-primary" />,
      title: "Full-Day",
      meta: "8 Hours",
      amount: yacht.pricing.fullDay,
      note: null as string | null,
      featured: true,
    },
    ...(yacht.pricing.multiDayPerDay
      ? [
          {
            key: "multi",
            icon: <Moon className="h-5 w-5 text-primary" />,
            title: "Multi-Day",
            meta: "Per Day",
            amount: yacht.pricing.multiDayPerDay,
            note: "per day" as string | null,
            featured: false,
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen pb-32 pt-28 lg:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Link
          href="/fleet"
          className="group mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Fleet
        </Link>

        <section className="mb-16">
          <Gallery images={yacht.images} title={yacht.name} className="mb-10" />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.base, ease: EASE }}
                className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
              >
                {yacht.name}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: DURATION.base, delay: 0.1, ease: EASE }}
                className="mt-2 text-lg text-muted"
              >
                {yacht.tagline}
              </motion.p>
            </div>
            <p className="shrink-0 text-2xl font-semibold text-primary-light sm:text-3xl">
              From {formatCurrency(yacht.pricing.halfDay)}
            </p>
          </div>

          {/* Headline specs */}
          <Stagger
            gap={STAGGER.tight}
            amount={0.3}
            className="mt-8 grid grid-cols-2 gap-5 rounded-2xl border border-border bg-surface p-6 sm:grid-cols-3 lg:grid-cols-5"
          >
            {headline.map((spec) => (
              <StaggerItem key={spec.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {spec.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                    {spec.label}
                  </p>
                  <p className="truncate text-sm font-semibold text-foreground">
                    {spec.node}
                  </p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          <Tabs.Root defaultValue="overview" className="min-w-0">
            <Tabs.List className="mb-8 flex overflow-x-auto border-b border-border">
              {TABS.map((tab) => (
                <Tabs.Trigger
                  key={tab.value}
                  value={tab.value}
                  className={cn(
                    "relative shrink-0 px-5 py-3 text-sm font-medium text-muted transition-colors",
                    "hover:text-foreground",
                    "data-[state=active]:text-primary-light",
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
                    "after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300",
                    "data-[state=active]:after:scale-x-100"
                  )}
                >
                  {tab.label}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            <Tabs.Content value="overview" className="space-y-10 focus-visible:outline-none">
              <Reveal>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  About This Yacht
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{yacht.description}</p>
              </Reveal>

              {yacht.features && yacht.features.length > 0 && (
                <Reveal delay={0.05}>
                  <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                    Key Features
                  </h3>
                  <CheckList items={yacht.features} />
                </Reveal>
              )}

              <Reveal delay={0.1}>
                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  Included in Every Charter
                </h3>
                <CheckList items={yacht.includes} />
              </Reveal>
            </Tabs.Content>

            <Tabs.Content value="amenities" className="focus-visible:outline-none">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Amenities
              </h2>
              <Stagger
                gap={STAGGER.tight}
                amount={0.1}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {yacht.amenities.map((amenity) => (
                  <StaggerItem
                    key={amenity}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-colors duration-300 hover:border-primary/30"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </StaggerItem>
                ))}
              </Stagger>
            </Tabs.Content>

            <Tabs.Content value="specs" className="focus-visible:outline-none">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Specifications
              </h2>
              <Stagger
                gap={STAGGER.tight}
                amount={0.1}
                className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              >
                {Object.entries(yacht.specs).map(([key, value]) => (
                  <StaggerItem
                    key={key}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5 transition-colors duration-300 hover:border-primary/30"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {SPEC_META[key]?.icon ?? <Anchor className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
                        {SPEC_META[key]?.label ?? key}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Tabs.Content>

            <Tabs.Content value="pricing" className="focus-visible:outline-none">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Charter Pricing
              </h2>
              <Stagger
                gap={STAGGER.base}
                amount={0.1}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {priceTiers.map((tier) => (
                  <StaggerItem key={tier.key} className="h-full">
                    <div
                      className={cn(
                        "flex h-full flex-col overflow-hidden rounded-2xl bg-surface transition-transform duration-300 hover:-translate-y-1",
                        tier.featured
                          ? "border-2 border-primary shadow-lg shadow-black/40"
                          : "border border-border"
                      )}
                    >
                      <div
                        className={cn(
                          "relative flex items-center gap-3 border-b p-5",
                          tier.featured
                            ? "border-primary/20 bg-primary/5"
                            : "border-border bg-surface-light"
                        )}
                      >
                        {tier.icon}
                        <div>
                          <h3 className="font-heading text-lg font-semibold text-foreground">
                            {tier.title}
                          </h3>
                          <p className="text-xs text-muted">{tier.meta}</p>
                        </div>
                        {tier.featured && (
                          <span className="absolute right-4 top-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0A0A0B]">
                            Popular
                          </span>
                        )}
                      </div>

                      <div className="flex flex-1 flex-col items-center justify-center p-6">
                        <p className="text-3xl font-bold text-primary-light">
                          {formatCurrency(tier.amount)}
                        </p>
                        <p className="mt-1 h-4 text-xs text-muted">{tier.note}</p>
                        <Button asChild className="mt-6 w-full">
                          <Link href={`/book/${yacht.slug}`}>Book Now</Link>
                        </Button>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </Stagger>
            </Tabs.Content>
          </Tabs.Root>

          {/* Sticky sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-heading text-xl font-semibold text-foreground">
                Book This Yacht
              </h2>
              <p className="mt-2 text-sm text-muted">
                Reserve the {yacht.name} for your next day on Miami&rsquo;s water.
              </p>

              <dl className="mt-6 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Half-Day (4h)</dt>
                  <dd className="font-semibold text-foreground">
                    {formatCurrency(yacht.pricing.halfDay)}
                  </dd>
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-muted">Full-Day (8h)</dt>
                  <dd className="font-semibold text-foreground">
                    {formatCurrency(yacht.pricing.fullDay)}
                  </dd>
                </div>
                {yacht.pricing.multiDayPerDay && (
                  <div className="flex items-center justify-between">
                    <dt className="text-muted">Multi-Day</dt>
                    <dd className="font-semibold text-foreground">
                      {formatCurrency(yacht.pricing.multiDayPerDay)}/day
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-6 border-t border-border pt-6">
                <Button asChild className="w-full">
                  <Link href={`/book/${yacht.slug}`}>Book This Yacht</Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted">
                  No commitment required. We confirm availability first.
                </p>
              </div>

              <ul className="mt-6 space-y-2 border-t border-border pt-6">
                {[
                  "Captain and crew included",
                  "Fuel included",
                  "Free cancellation 48h prior",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-xs text-muted">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Mobile booking bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-navy/95 p-4 backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted">Starting from</p>
            <p className="text-lg font-bold text-primary-light">
              {formatCurrency(yacht.pricing.halfDay)}
            </p>
          </div>
          <Button asChild>
            <Link href={`/book/${yacht.slug}`}>Book This Yacht</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
