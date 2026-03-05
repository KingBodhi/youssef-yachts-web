"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

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
    body: "Our firm needed a venue for 25 clients and the 92-foot Leopard was absolutely perfect. The jacuzzi, the club area, the sound system -- our guests are still talking about it weeks later. The Yousef Yachts team handled every detail so we could focus on our clients.",
    rating: 5,
  },
  {
    name: "David & Friends",
    occasion: "Bachelor Party",
    body: "Rented the Princess V65 for a bachelor party weekend and it was next level. Captain Mike knew all the best spots on Biscayne Bay, the water toys kept everyone entertained, and the all-inclusive pricing meant zero stress. Already planning our next trip.",
    rating: 5,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

export function TestimonialsSection() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section ref={ref} className="relative bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          variants={headingVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
            Testimonials
          </p>
          <h2 className="mt-3 font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            What Our Guests Say
          </h2>
        </motion.div>

        {/* Testimonial cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              className={cn(
                "relative rounded-2xl border border-border bg-surface p-8",
                "transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              {/* Quote icon */}
              <Quote className="mb-4 h-8 w-8 text-primary/30" />

              {/* Stars */}
              <div className="mb-4 flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-primary-light text-primary-light"
                  />
                ))}
              </div>

              {/* Body */}
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{testimonial.body}&rdquo;
              </p>

              {/* Attribution */}
              <div className="mt-6 border-t border-border pt-4">
                <p className="font-heading text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-primary-light">
                  {testimonial.occasion}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
