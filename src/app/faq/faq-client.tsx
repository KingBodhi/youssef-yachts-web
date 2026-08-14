"use client";

import * as Accordion from "@radix-ui/react-accordion";
import Link from "next/link";
import { ChevronDown, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";
import { FAQ_CATEGORIES, type FaqItem } from "./faq-data";

function AccordionRow({ item, value }: { item: FaqItem; value: string }) {
  return (
    <Accordion.Item
      value={value}
      className="group border-b border-border last:border-b-0"
    >
      <Accordion.Header>
        <Accordion.Trigger
          className={cn(
            "flex w-full items-center justify-between gap-4 py-5 text-left",
            "text-base font-medium text-foreground transition-colors duration-200",
            "hover:text-primary-light focus-visible:outline-none focus-visible:text-primary-light",
            "[&[data-state=open]>svg]:rotate-180"
          )}
        >
          {item.question}
          <ChevronDown className="h-4 w-4 shrink-0 text-muted transition-transform duration-300" />
        </Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
        <p className="pb-5 pr-8 text-sm leading-relaxed text-muted">{item.answer}</p>
      </Accordion.Content>
    </Accordion.Item>
  );
}

export function FaqClient() {
  return (
    <>
      <PageHero
        eyebrow="Support"
        title="Frequently Asked Questions"
        accentFrom={1}
        lede={`Everything you need to know about chartering with ${BRAND.name}. If your question is not here, our team is one call away.`}
      />

      <Section space="tight" className="pt-0">
        <div className="mx-auto max-w-3xl space-y-14">
          {FAQ_CATEGORIES.map((category) => (
            <Reveal key={category.id} as="section" className="scroll-mt-28" >
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground sm:text-2xl">
                  {category.title}
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded-full bg-primary" />
              </div>

              <Accordion.Root
                type="single"
                collapsible
                className="rounded-2xl border border-border bg-surface px-6"
              >
                {category.items.map((item, itemIndex) => (
                  <AccordionRow
                    key={item.question}
                    item={item}
                    value={`${category.id}-${itemIndex}`}
                  />
                ))}
              </Accordion.Root>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="raised" space="tight" rules>
        <div className="mx-auto max-w-3xl text-center">
          <Stagger className="mb-2 flex justify-center">
            <StaggerItem className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </StaggerItem>
          </Stagger>

          <SectionHeading
            eyebrow="Still Deciding"
            title="Talk to a Human"
            lede="Our concierge team can answer anything about your charter, vessel options, or a special request."
          />

          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/contact">
                <MessageCircle className="h-4 w-4" />
                Contact Us
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`}>
                <Phone className="h-4 w-4" />
                {BRAND.phone}
              </a>
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}
