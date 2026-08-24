import type { Metadata } from "next";
import Link from "next/link";
import { Shield, Gem, Crown, Anchor, Award } from "lucide-react";
import { BRAND } from "@/lib/constants";
import { getActiveYachts } from "@/lib/data/yachts";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { CountUp } from "@/components/ui/count-up";
import { ParallaxImage } from "@/components/ui/parallax";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: `About Us | ${BRAND.name}`,
  description:
    "Hurry Up Slowly Yachts is a Miami yacht charter built on safety, professional crews and concierge service. Meet the team behind the fleet.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About Us | ${BRAND.name}`,
    description:
      "A Miami yacht charter built on safety, professional crews and concierge service.",
    url: "/about",
    siteName: BRAND.name,
    type: "website",
  },
};

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Every vessel in our fleet meets or exceeds U.S. Coast Guard compliance standards. We are fully insured and our captains hold active USCG licenses, so your peace of mind starts the moment you step aboard.",
  },
  {
    icon: Gem,
    title: "Meticulous Maintenance",
    description:
      "Our fleet is meticulously maintained. Each yacht is inspected and detailed before every charter, which is what keeps a pristine boat a predictable outcome rather than a lucky one.",
  },
  {
    icon: Crown,
    title: "White-Glove Service",
    description:
      "From your first inquiry to the moment you step off the dock, a dedicated concierge handles every detail. We build each charter around your occasion, your preferences and your guest list.",
  },
];

const badges = [
  { icon: Anchor, label: "USCG Licensed" },
  { icon: Shield, label: "Fully Insured" },
  { icon: Award, label: "Miami Based" },
];

export default function AboutPage() {
  const fleet = getActiveYachts();

  const largest = Math.max(...fleet.map((y) => y.length));
  const maxGuests = Math.max(...fleet.map((y) => y.capacity));

  const stats: {
    value: number;
    suffix: string;
    label: string;
    separator: boolean;
  }[] = [
    { value: fleet.length, suffix: "", label: "Yachts in the fleet", separator: false },
    { value: largest, suffix: " ft", label: "Longest yacht", separator: true },
    { value: maxGuests, suffix: "", label: "Guests on a charter", separator: false },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Us"
        title="About Hurry Up Slowly Yachts"
        accentFrom={1}
        lede="A Miami yacht charter built on safety, professional crews, and days on the water people remember."
      />

      {/* Story */}
      <Section space="base">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          <Reveal from="right">
            <p className="flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-primary-light sm:text-sm">
              <span className="animate-pulse-line h-px w-8 bg-primary-light/40" />
              Our Story
            </p>
            <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Crewed Charters on{" "}
              <br />
              <span className="text-brand-gradient">Miami&rsquo;s Water</span>
            </h2>
            <div className="mt-8 space-y-5 text-base leading-relaxed text-muted">
              <p>
                {BRAND.name} is a Miami yacht charter built on a simple
                standard: handpicked vessels, professional crews, and days on
                the water that guests remember. Every charter is planned around
                your occasion, not a template.
              </p>
              <p>
                The fleet spans intimate day boats to a 92-foot flagship, each
                maintained to charter-ready condition and crewed by a licensed
                captain. Led by {BRAND.contactName}, the team handles every
                detail, from route to provisioning, so you can focus on the day
                itself.
              </p>
              <p>
                A sunset cruise through Biscayne Bay, a celebration anchored off
                Star Island, a multi-day voyage to the Bahamas. Our team treats
                every charter with the same care and precision that made us a
                familiar name in Miami&rsquo;s yachting community.
              </p>
            </div>
          </Reveal>

          <Reveal from="left" className="relative">
            <div className="rounded-2xl border border-border bg-surface p-8 lg:p-12">
              <Stagger gap={0.14} className="space-y-8">
                {stats.map((stat, i) => (
                  <StaggerItem
                    key={stat.label}
                    className={cn(
                      i < stats.length - 1 && "border-b border-border pb-8"
                    )}
                  >
                    <p className="font-heading text-5xl font-bold text-primary">
                      <CountUp
                        value={stat.value}
                        suffix={stat.suffix}
                        separator={stat.separator}
                      />
                    </p>
                    <p className="mt-2 text-muted">{stat.label}</p>
                  </StaggerItem>
                ))}
              </Stagger>
            </div>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-primary/5 blur-2xl"
            />
          </Reveal>
        </div>
      </Section>

      {/* Full-bleed break */}
      <ParallaxImage
        src="/yachts/leopard-82/01.jpg"
        alt="A charter yacht anchored off the Miami shoreline"
        className="h-[42vh] min-h-[320px] sm:h-[52vh]"
        imageClassName="object-[50%_42%]"
        intensity={0.3}
        scrim={0.5}
      />

      {/* Values */}
      <Section tone="raised" rules>
        <SectionHeading
          eyebrow="What Sets Us Apart"
          title="Our Core Values"
          lede="Three standards that decide how every charter is planned, crewed and run."
        />

        <Stagger className="mt-16 grid gap-8 md:grid-cols-3">
          {values.map((value) => (
            <StaggerItem
              key={value.title}
              as="article"
              className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-8 transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/40"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                <value.icon className="h-7 w-7" />
              </div>
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {value.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                {value.description}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* Trust badges */}
      <Section>
        <SectionHeading
          eyebrow="Trusted and Certified"
          title="Charter With Confidence"
          lede="We hold ourselves to the highest industry standards so you can focus on the day itself."
        />

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-3">
          {badges.map((badge) => (
            <StaggerItem
              key={badge.label}
              className="group flex flex-col items-center rounded-2xl border border-border bg-surface p-10 text-center transition-all duration-500 hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:border-primary/50 group-hover:bg-primary/10">
                <badge.icon className="h-9 w-9" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-foreground">
                {badge.label}
              </h3>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      {/* CTA */}
      <Section tone="raised" space="tight" rules>
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeading
            eyebrow="Next Step"
            title="Start Planning Your Charter"
            accentFrom={1}
            lede="Get in touch with our concierge team and we will shape the day around your occasion."
          />
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/contact">Contact Us</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/fleet">View Our Fleet</Link>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
