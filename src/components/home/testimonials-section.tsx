"use client";

import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/section";
import { SectionHeading } from "@/components/ui/section-heading";
import { Stagger, StaggerItem } from "@/components/ui/reveal";

const testimonials = [
  {
    name: "Carlos & Maria R.",
    occasion: "Anniversary Cruise",
    body: "We booked the 86-foot Leopard for our 10th anniversary and it exceeded every expectation. The crew set up champagne and roses on the flybridge as we cruised past Star Island at sunset. Truly the most memorable evening we have ever had in Miami.",
    rating: 5,
  },
  {
    name: "Jessica T.",
    occasion: "Corporate Event",
    body: "Our firm needed a venue for 25 clients and the 92-foot Leopard was perfect. The jacuzzi, the club area, the sound system: our guests are still talking about it weeks later. The Hurry Up Slowly team handled every detail so we could focus on our clients.",
    rating: 5,
  },
  {
    name: "David & Friends",
    occasion: "Bachelor Party",
    body: "Rented the Princess V65 for a bachelor party weekend and it was next level. Captain Mike knew all the best spots on Biscayne Bay, the water toys kept everyone entertained, and the all-inclusive pricing meant zero stress. Already planning our next trip.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <Section tone="base">
      <SectionHeading
        eyebrow="Testimonials"
        title="What Our Guests Say"
        lede="Every charter is judged on the same thing: whether the day was worth remembering."
      />

      <Stagger className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <StaggerItem
            key={testimonial.name}
            as="figure"
            className={cn(
              "relative flex h-full flex-col rounded-2xl border border-border bg-surface p-8",
              "transition-all duration-500 hover:-translate-y-1 hover:border-primary/30 hover:shadow-2xl hover:shadow-black/40"
            )}
          >
            <Quote className="mb-4 h-8 w-8 shrink-0 text-primary/30" />

            <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={i}
                  aria-hidden="true"
                  className="h-4 w-4 fill-primary-light text-primary-light"
                />
              ))}
            </div>

            <blockquote className="text-sm leading-relaxed text-muted">
              &ldquo;{testimonial.body}&rdquo;
            </blockquote>

            <figcaption className="mt-auto border-t border-border pt-4">
              <p className="font-heading text-sm font-semibold text-foreground">
                {testimonial.name}
              </p>
              <p className="text-xs text-primary-light">{testimonial.occasion}</p>
            </figcaption>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
