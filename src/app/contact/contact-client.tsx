"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { motion } from "framer-motion";
import {
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, CHARTER_TYPES, ADD_ONS } from "@/lib/constants";
import { DURATION, EASE } from "@/lib/motion";
import { PageHero } from "@/components/ui/page-hero";
import { Section } from "@/components/ui/section";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/reveal";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-+()]{7,20}$/, "Please enter a valid phone number"),
  preferredDate: z.string().min(1, "Please select a preferred date"),
  partySize: z
    .string()
    .min(1, "Party size is required")
    .refine((val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 1 && num <= 200;
    }, "Party size must be between 1 and 200"),
  charterType: z.string().min(1, "Please select a charter type"),
  occasion: z.string().max(100),
  addOns: z.array(z.string()),
  message: z.string().max(2000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Phone,
    label: "Call",
    value: BRAND.phone,
    href: `tel:${BRAND.phoneHref}`,
  },
  {
    icon: MessageSquare,
    label: "Text",
    value: BRAND.phone,
    href: `sms:${BRAND.phoneHref}`,
  },
  {
    icon: MapPin,
    label: "Location",
    value: BRAND.location,
    href: undefined,
  },
];

const businessHours = [
  { days: "Monday to Saturday", hours: "8:00 AM to 8:00 PM" },
  { days: "Sunday", hours: "9:00 AM to 6:00 PM" },
];

const inputClasses =
  "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClasses = "mb-1.5 block text-sm font-medium text-foreground/80";
const errorClasses = "mt-1.5 text-xs text-primary-light";
const cardClasses = "rounded-2xl border border-border bg-surface p-6";

function buildRequestText(data: ContactFormData): string {
  const charter =
    CHARTER_TYPES.find((c) => c.id === data.charterType)?.label ??
    data.charterType;
  const addOns = data.addOns
    .map((id) => ADD_ONS.find((a) => a.id === id)?.name ?? id)
    .join(", ");
  const lines = [
    `Charter inquiry for ${BRAND.name}`,
    `Name: ${data.firstName} ${data.lastName}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    `Preferred date: ${data.preferredDate}`,
    `Party size: ${data.partySize}`,
    `Charter type: ${charter}`,
    data.occasion ? `Occasion: ${data.occasion}` : "",
    addOns ? `Add-ons: ${addOns}` : "",
    data.message ? `Details: ${data.message}` : "",
  ].filter(Boolean);
  return lines.join("\n");
}

export function ContactClient() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [requestText, setRequestText] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      preferredDate: "",
      partySize: "",
      charterType: "",
      occasion: "",
      addOns: [],
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setRequestText(buildRequestText(data));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    const smsHref = `sms:${BRAND.phoneHref}?&body=${encodeURIComponent(
      requestText
    )}`;
    return (
      <div className="flex min-h-screen items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: DURATION.base, ease: EASE }}
          className="mx-auto max-w-lg rounded-2xl border border-border bg-surface p-10 text-center sm:p-12"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-10 w-10 text-primary-light" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-foreground">
            Your Request Is Ready
          </h1>
          <p className="mt-4 text-muted">
            Send the details straight to {BRAND.contactName}, or call to plan
            your charter and confirm availability.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <a href={`tel:${BRAND.phoneHref}`}>
                <Phone className="h-4 w-4" />
                Call {BRAND.contactName}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href={smsHref}>
                <MessageSquare className="h-4 w-4" />
                Text Your Request
              </a>
            </Button>
          </div>

          <p className="mt-6 text-sm text-muted/70">
            {BRAND.phone}
          </p>

          <Button
            variant="ghost"
            className="mt-6"
            onClick={() => {
              reset();
              setIsSubmitted(false);
            }}
          >
            Start a New Request
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <PageHero
        eyebrow="Get in Touch"
        title="Plan Your Perfect Charter"
        accentFrom={2}
        lede="Tell us about the day you have in mind and our team will build the itinerary around it."
      />

      <Section space="tight" className="pt-0">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* Form */}
          <Reveal className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 lg:p-10">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Charter Inquiry
                </h2>
                <p className="mt-1 text-sm text-muted">
                  Fields marked with an asterisk are required. On the next step
                  you can send your request by text or call us directly.
                </p>

                <div className="mt-8 space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="firstName" className={labelClasses}>
                        First Name *
                      </label>
                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        aria-invalid={!!errors.firstName}
                        className={inputClasses}
                        placeholder="First name"
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p className={errorClasses}>{errors.firstName.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="lastName" className={labelClasses}>
                        Last Name *
                      </label>
                      <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        aria-invalid={!!errors.lastName}
                        className={inputClasses}
                        placeholder="Last name"
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p className={errorClasses}>{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="email" className={labelClasses}>
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        className={inputClasses}
                        placeholder="you@example.com"
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className={errorClasses}>{errors.email.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClasses}>
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        autoComplete="tel"
                        aria-invalid={!!errors.phone}
                        className={inputClasses}
                        placeholder="Your phone number"
                        {...register("phone")}
                      />
                      {errors.phone && (
                        <p className={errorClasses}>{errors.phone.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="preferredDate" className={labelClasses}>
                        Preferred Date *
                      </label>
                      <input
                        id="preferredDate"
                        type="date"
                        aria-invalid={!!errors.preferredDate}
                        className={inputClasses}
                        {...register("preferredDate")}
                      />
                      {errors.preferredDate && (
                        <p className={errorClasses}>
                          {errors.preferredDate.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="partySize" className={labelClasses}>
                        Party Size *
                      </label>
                      <input
                        id="partySize"
                        type="number"
                        min={1}
                        max={200}
                        aria-invalid={!!errors.partySize}
                        className={inputClasses}
                        placeholder="12"
                        {...register("partySize")}
                      />
                      {errors.partySize && (
                        <p className={errorClasses}>{errors.partySize.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="charterType" className={labelClasses}>
                        Charter Type *
                      </label>
                      <select
                        id="charterType"
                        aria-invalid={!!errors.charterType}
                        className={inputClasses}
                        {...register("charterType")}
                      >
                        <option value="">Select a charter type</option>
                        {CHARTER_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.label} ({type.duration})
                          </option>
                        ))}
                      </select>
                      {errors.charterType && (
                        <p className={errorClasses}>{errors.charterType.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="occasion" className={labelClasses}>
                        Occasion
                      </label>
                      <input
                        id="occasion"
                        type="text"
                        className={inputClasses}
                        placeholder="Birthday, corporate, celebration"
                        {...register("occasion")}
                      />
                      {errors.occasion && (
                        <p className={errorClasses}>{errors.occasion.message}</p>
                      )}
                    </div>
                  </div>

                  <fieldset>
                    <legend className={labelClasses}>Add-Ons (optional)</legend>
                    <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {ADD_ONS.map((addon) => (
                        <label
                          key={addon.id}
                          className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground/80 transition-colors duration-200 hover:border-primary/30 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
                        >
                          <input
                            type="checkbox"
                            value={addon.id}
                            className="h-4 w-4 rounded border-border bg-surface accent-primary"
                            {...register("addOns")}
                          />
                          {addon.name}
                        </label>
                      ))}
                    </div>
                  </fieldset>

                  <div>
                    <label htmlFor="message" className={labelClasses}>
                      Additional Details
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className={`${inputClasses} resize-y`}
                      placeholder="Tell us about your ideal charter, special requests, dietary needs, or any questions you have."
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className={errorClasses}>{errors.message.message}</p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <MessageSquare className="h-4 w-4" />
                    Continue
                  </Button>
                </div>
              </div>
            </form>
          </Reveal>

          {/* Sidebar */}
          <Stagger className="space-y-6">
            <StaggerItem className={cardClasses}>
              <h2 className="font-heading text-lg font-semibold text-foreground">
                Contact Information
              </h2>
              <div className="mt-5 space-y-4">
                {contactInfo.map((item) =>
                  item.href ? (
                    <a
                      key={item.label}
                      href={item.href}
                      className="flex items-start gap-3 text-sm text-muted transition-colors duration-200 hover:text-primary-light"
                    >
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="sr-only">{item.label}: </span>
                        {item.value}
                      </span>
                    </a>
                  ) : (
                    <div
                      key={item.label}
                      className="flex items-start gap-3 text-sm text-muted"
                    >
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>
                        <span className="sr-only">{item.label}: </span>
                        {item.value}
                      </span>
                    </div>
                  )
                )}
              </div>
            </StaggerItem>

            <StaggerItem className={cardClasses}>
              <h2 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <Clock className="h-4 w-4 text-primary" />
                Business Hours
              </h2>
              <dl className="mt-5 space-y-3">
                {businessHours.map((item) => (
                  <div
                    key={item.days}
                    className="flex items-center justify-between text-sm"
                  >
                    <dt className="text-muted">{item.days}</dt>
                    <dd className="font-medium text-foreground/80">{item.hours}</dd>
                  </div>
                ))}
              </dl>
            </StaggerItem>

            <StaggerItem className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
              <p className="text-sm font-semibold text-primary-light">
                Same-day availability
              </p>
              <p className="mt-2 text-sm text-muted">
                Call or text {BRAND.contactName} directly for same-day openings
                and last-minute bookings.
              </p>
              <a
                href={`tel:${BRAND.phoneHref}`}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary-light transition-colors hover:text-white"
              >
                <Phone className="h-4 w-4" />
                {BRAND.phone}
              </a>
            </StaggerItem>
          </Stagger>
        </div>
      </Section>
    </>
  );
}
