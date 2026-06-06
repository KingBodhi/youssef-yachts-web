"use client";

import { motion } from "framer-motion";
import { Shield, Gem, Crown, Anchor, Award, CheckCircle } from "lucide-react";
import { BRAND } from "@/lib/constants";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const values = [
  {
    icon: Shield,
    title: "Safety First",
    description:
      "Every vessel in our fleet meets or exceeds U.S. Coast Guard compliance standards. We are fully insured and our captains hold active USCG licenses, ensuring your peace of mind from the moment you step aboard.",
  },
  {
    icon: Gem,
    title: "Unmatched Quality",
    description:
      "Our fleet is meticulously maintained to the highest standards. Each yacht undergoes rigorous inspections and detailing before every charter, guaranteeing a pristine, flawless experience on the water.",
  },
  {
    icon: Crown,
    title: "White-Glove Service",
    description:
      "From your first inquiry to the moment you step off the dock, a dedicated concierge ensures every detail is handled. We craft bespoke experiences tailored to your occasion, preferences, and vision.",
  },
];

const badges = [
  { icon: Anchor, label: "USCG Licensed" },
  { icon: Shield, label: "Fully Insured" },
  { icon: Award, label: "Miami's Top Charter" },
];

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <section className="relative flex min-h-[60vh] items-center justify-center bg-gradient-to-b from-navy via-background to-background pt-20">
        {/* Background decorative elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-[400px] w-[400px] rounded-full bg-primary-dark/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-4 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              Our Legacy
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              About{" "}
              <span className="text-brand-gradient">Hurry Up Slowly</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted"
            >
              One of Miami&apos;s most trusted names in luxury yacht charters,
              built on a foundation of safety, excellence, and unforgettable
              experiences on the water.
            </motion.p>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>

      {/* Our Story Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            {/* Left column - Story content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
            >
              <motion.p
                variants={fadeUp}
                custom={0}
                className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
              >
                Our Story
              </motion.p>
              <motion.h2
                variants={fadeUp}
                custom={1}
                className="font-heading text-3xl font-bold text-foreground sm:text-4xl"
              >
                A Cornerstone of Miami&apos;s
                <br />
                <span className="text-primary">Yacht Charter Industry</span>
              </motion.h2>
              <motion.div
                variants={fadeUp}
                custom={2}
                className="mt-8 space-y-5 text-base leading-relaxed text-muted"
              >
                <p>
                  {BRAND.name} has been a cornerstone of Miami&apos;s yacht charter
                  industry for years, earning the trust of locals and visitors
                  alike through an uncompromising commitment to safety, luxury,
                  and client satisfaction.
                </p>
                <p>
                  What began as a passion for the open water has grown into one of
                  Miami&apos;s most sought-after charter operations. Under
                  Yousef&apos;s leadership, every vessel, every route, and every
                  detail has been curated with a singular focus: delivering a
                  world-class experience that exceeds expectations.
                </p>
                <p>
                  Whether it&apos;s a sunset cruise through Biscayne Bay, a
                  celebration anchored off Star Island, or a multi-day voyage to
                  the Bahamas, our team treats every charter with the same level
                  of care and precision that has made us a household name among
                  Miami&apos;s yachting community.
                </p>
              </motion.div>
            </motion.div>

            {/* Right column - Stats / visual element */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={stagger}
              className="relative"
            >
              <div className="rounded-lg border border-border bg-surface p-8 lg:p-12">
                <motion.div variants={fadeUp} custom={0} className="space-y-8">
                  <div className="border-b border-border pb-8">
                    <p className="font-heading text-5xl font-bold text-primary">
                      Years
                    </p>
                    <p className="mt-2 text-muted">
                      of trusted service on Miami&apos;s waters
                    </p>
                  </div>
                  <div className="border-b border-border pb-8">
                    <p className="font-heading text-5xl font-bold text-primary-light">
                      1,000+
                    </p>
                    <p className="mt-2 text-muted">
                      successful charters completed
                    </p>
                  </div>
                  <div>
                    <p className="font-heading text-5xl font-bold text-accent">
                      5-Star
                    </p>
                    <p className="mt-2 text-muted">
                      average rating from verified clients
                    </p>
                  </div>
                </motion.div>
              </div>
              {/* Decorative glow */}
              <div className="pointer-events-none absolute -inset-4 -z-10 rounded-xl bg-primary/5 blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Grid */}
      <section className="relative bg-navy/40 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              What Sets Us Apart
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-heading text-3xl font-bold text-foreground sm:text-4xl"
            >
              Our Core Values
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="mt-16 grid gap-8 md:grid-cols-3"
          >
            {values.map((value, i) => (
              <motion.div
                key={value.title}
                variants={fadeUp}
                custom={i}
                className="group relative rounded-lg border border-border bg-surface p-8 transition-all duration-500 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary/20">
                  <value.icon className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
            className="text-center"
          >
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              Trusted & Certified
            </motion.p>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="font-heading text-3xl font-bold text-foreground sm:text-4xl"
            >
              Charter With Confidence
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-xl text-muted"
            >
              We hold ourselves to the highest industry standards so you can
              focus on enjoying the experience.
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mt-16 grid gap-6 sm:grid-cols-3"
          >
            {badges.map((badge, i) => (
              <motion.div
                key={badge.label}
                variants={fadeUp}
                custom={i}
                className="group flex flex-col items-center rounded-lg border border-border bg-surface p-10 text-center transition-all duration-500 hover:border-primary/30"
              >
                <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-primary transition-all duration-300 group-hover:border-primary/40 group-hover:bg-primary/10">
                  <badge.icon className="h-9 w-9" />
                </div>
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  {badge.label}
                </h3>
                <CheckCircle className="mt-3 h-5 w-5 text-green-400" />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-navy/40 py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="font-heading text-3xl font-bold text-foreground sm:text-4xl"
            >
              Ready to Experience the{" "}
              <span className="text-primary">Hurry Up Slowly</span> Difference?
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-xl text-muted"
            >
              Get in touch with our concierge team to start planning your
              unforgettable charter experience on Miami&apos;s waters.
            </motion.p>
            <motion.div
              variants={fadeUp}
              custom={2}
              className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
            >
              <a
                href="/contact"
                className="inline-flex h-13 items-center justify-center rounded-sm bg-primary px-8 text-base font-medium uppercase tracking-wide text-[#0A0A0B] shadow-md transition-all duration-300 hover:bg-primary-light hover:shadow-lg hover:shadow-black/30"
              >
                Contact Us
              </a>
              <a
                href="/fleet"
                className="inline-flex h-13 items-center justify-center rounded-sm border border-primary bg-transparent px-8 text-base font-medium uppercase tracking-wide text-primary transition-all duration-300 hover:bg-primary/10"
              >
                View Our Fleet
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
