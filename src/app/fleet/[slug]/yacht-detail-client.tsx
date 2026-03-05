"use client";

import Link from "next/link";
import Image from "next/image";
import * as Tabs from "@radix-ui/react-tabs";
import {
  Anchor,
  Users,
  BedDouble,
  UserCheck,
  Calendar,
  CheckCircle2,
  Clock,
  Sun,
  Moon,
  Ruler,
  ArrowLeft,
} from "lucide-react";
import type { Yacht } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";

interface YachtDetailClientProps {
  yacht: Yacht;
}

const specIcons: Record<string, React.ReactNode> = {
  length: <Ruler className="h-5 w-5 text-primary" />,
  beam: <Ruler className="h-5 w-5 text-primary" />,
  draft: <Anchor className="h-5 w-5 text-primary" />,
  speed: <Anchor className="h-5 w-5 text-primary" />,
  fuelCapacity: <Anchor className="h-5 w-5 text-primary" />,
  waterCapacity: <Anchor className="h-5 w-5 text-primary" />,
};

const specLabels: Record<string, string> = {
  length: "Length",
  beam: "Beam",
  draft: "Draft",
  speed: "Top Speed",
  fuelCapacity: "Fuel Capacity",
  waterCapacity: "Water Capacity",
};

export function YachtDetailClient({ yacht }: YachtDetailClientProps) {
  return (
    <div className="min-h-screen pb-24 pt-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link
          href="/fleet"
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary-light"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fleet
        </Link>

        {/* Hero Section */}
        <section className="mb-12">
          {/* Hero Image */}
          <div className="relative mb-8 aspect-[21/9] overflow-hidden rounded-2xl border border-border bg-navy">
            <Image
              src={yacht.heroImage}
              alt={yacht.name}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>

          {/* Image Gallery */}
          {yacht.images.length > 1 && (
            <div className="mb-8 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {yacht.images.slice(1).map((img, i) => (
                <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-navy">
                  <Image
                    src={img}
                    alt={`${yacht.name} - ${i + 2}`}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, 16vw"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                {yacht.name}
              </h1>
              <p className="mt-2 text-lg text-muted">{yacht.tagline}</p>
            </div>
            <p className="text-2xl font-semibold text-primary-light sm:text-3xl">
              From {formatCurrency(yacht.pricing.halfDay)}
            </p>
          </div>

          {/* Specs Strip */}
          <div className="mt-8 flex flex-wrap gap-4 rounded-xl border border-border bg-surface p-4 sm:gap-8 sm:p-6">
            {[
              { icon: <Ruler className="h-5 w-5" />, label: "Length", value: `${yacht.length}'` },
              { icon: <Users className="h-5 w-5" />, label: "Capacity", value: `${yacht.capacity} guests` },
              { icon: <BedDouble className="h-5 w-5" />, label: "Cabins", value: `${yacht.cabins}` },
              { icon: <UserCheck className="h-5 w-5" />, label: "Crew", value: `${yacht.crew}` },
              { icon: <Calendar className="h-5 w-5" />, label: "Year", value: `${yacht.year}` },
            ].map((spec) => (
              <div key={spec.label} className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {spec.icon}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted">
                    {spec.label}
                  </p>
                  <p className="text-sm font-semibold text-foreground">{spec.value}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Main Content + Sidebar */}
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Tabs Content */}
          <Tabs.Root defaultValue="overview" className="min-w-0">
            <Tabs.List className="mb-8 flex border-b border-border">
              {["overview", "amenities", "specs", "pricing"].map((tab) => (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "relative px-5 py-3 text-sm font-medium capitalize text-muted transition-colors",
                    "hover:text-foreground",
                    "data-[state=active]:text-primary-light",
                    "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5",
                    "after:scale-x-0 after:bg-primary after:transition-transform after:duration-200",
                    "data-[state=active]:after:scale-x-100"
                  )}
                >
                  {tab}
                </Tabs.Trigger>
              ))}
            </Tabs.List>

            {/* Overview Tab */}
            <Tabs.Content value="overview" className="space-y-8">
              <div>
                <h2 className="font-heading text-2xl font-semibold text-foreground">
                  About This Yacht
                </h2>
                <p className="mt-4 leading-relaxed text-muted">{yacht.description}</p>
              </div>

              {yacht.features && yacht.features.length > 0 && (
                <div>
                  <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                    Key Features
                  </h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {yacht.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                        <span className="text-sm text-muted">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h3 className="mb-4 font-heading text-xl font-semibold text-foreground">
                  What&apos;s Included
                </h3>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {yacht.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                      <span className="text-sm text-muted">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Tabs.Content>

            {/* Amenities Tab */}
            <Tabs.Content value="amenities">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Amenities
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {yacht.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <span className="text-sm text-foreground">{amenity}</span>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            {/* Specs Tab */}
            <Tabs.Content value="specs">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Specifications
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(yacht.specs).map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center gap-4 rounded-xl border border-border bg-surface p-5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      {specIcons[key] ?? <Anchor className="h-5 w-5 text-primary" />}
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wider text-muted">
                        {specLabels[key] ?? key}
                      </p>
                      <p className="text-sm font-semibold text-foreground">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Tabs.Content>

            {/* Pricing Tab */}
            <Tabs.Content value="pricing">
              <h2 className="mb-6 font-heading text-2xl font-semibold text-foreground">
                Charter Pricing
              </h2>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Half-Day */}
                <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                  <div className="flex items-center gap-3 border-b border-border bg-surface-light p-5">
                    <Sun className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Half-Day
                      </h3>
                      <p className="text-xs text-muted">4 Hours</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-6">
                    <p className="text-3xl font-bold text-primary-light">
                      {formatCurrency(yacht.pricing.halfDay)}
                    </p>
                    <Link
                      href={`/book/${yacht.id}`}
                      className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Full-Day */}
                <div className="relative flex flex-col overflow-hidden rounded-2xl border-2 border-primary bg-surface shadow-lg shadow-primary/10">
                  <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-0.5 text-xs font-semibold text-white">
                    Popular
                  </div>
                  <div className="flex items-center gap-3 border-b border-primary/20 bg-primary/5 p-5">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        Full-Day
                      </h3>
                      <p className="text-xs text-muted">8 Hours</p>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col items-center justify-center p-6">
                    <p className="text-3xl font-bold text-primary-light">
                      {formatCurrency(yacht.pricing.fullDay)}
                    </p>
                    <Link
                      href={`/book/${yacht.id}`}
                      className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>

                {/* Multi-Day */}
                {yacht.pricing.multiDayPerDay && (
                  <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface">
                    <div className="flex items-center gap-3 border-b border-border bg-surface-light p-5">
                      <Moon className="h-5 w-5 text-primary" />
                      <div>
                        <h3 className="font-heading text-lg font-semibold text-foreground">
                          Multi-Day
                        </h3>
                        <p className="text-xs text-muted">Per Day</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center justify-center p-6">
                      <p className="text-3xl font-bold text-primary-light">
                        {formatCurrency(yacht.pricing.multiDayPerDay)}
                      </p>
                      <p className="mt-1 text-xs text-muted">per day</p>
                      <Link
                        href={`/book/${yacht.id}`}
                        className="mt-6 w-full rounded-lg bg-primary px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-primary-light"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </Tabs.Content>
          </Tabs.Root>

          {/* Sticky Sidebar CTA */}
          <aside className="hidden lg:block">
            <div className="sticky top-32 rounded-2xl border border-border bg-surface p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                Book This Yacht
              </h3>
              <p className="mt-2 text-sm text-muted">
                Reserve the {yacht.name} for your next unforgettable Miami
                experience.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Half-Day (4h)</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(yacht.pricing.halfDay)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted">Full-Day (8h)</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(yacht.pricing.fullDay)}
                  </span>
                </div>
                {yacht.pricing.multiDayPerDay && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">Multi-Day</span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(yacht.pricing.multiDayPerDay)}/day
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-6 border-t border-border pt-6">
                <Link
                  href={`/book/${yacht.id}`}
                  className="block w-full rounded-xl bg-primary px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light hover:shadow-primary-light/25"
                >
                  Book This Yacht
                </Link>
                <p className="mt-3 text-center text-xs text-muted">
                  No commitment required. We&apos;ll confirm availability.
                </p>
              </div>

              <div className="mt-6 space-y-2 border-t border-border pt-6">
                <div className="flex items-center gap-2 text-xs text-muted">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Captain &amp; crew included
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Fuel included
                </div>
                <div className="flex items-center gap-2 text-xs text-muted">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  Free cancellation 48h prior
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Mobile Sticky CTA */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-navy/95 p-4 backdrop-blur-md lg:hidden">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div>
              <p className="text-xs text-muted">Starting from</p>
              <p className="text-lg font-bold text-primary-light">
                {formatCurrency(yacht.pricing.halfDay)}
              </p>
            </div>
            <Link
              href={`/book/${yacht.id}`}
              className="rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-light"
            >
              Book This Yacht
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
