"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
import { motion } from "framer-motion";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Instagram,
  Facebook,
  Youtube,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND, CHARTER_TYPES, ADD_ONS } from "@/lib/constants";

const contactSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(
      /^[\d\s\-\+\(\)]{7,20}$/,
      "Please enter a valid phone number"
    ),
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

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

const contactInfo = [
  { icon: Phone, label: "Phone", value: BRAND.phone, href: `tel:${BRAND.phone.replace(/\D/g, "")}` },
  { icon: Mail, label: "Email", value: BRAND.email, href: `mailto:${BRAND.email}` },
  { icon: MapPin, label: "Address", value: BRAND.address, href: `https://maps.google.com/?q=${encodeURIComponent(BRAND.address)}` },
];

const businessHours = [
  { days: "Monday - Saturday", hours: "8:00 AM - 8:00 PM" },
  { days: "Sunday", hours: "9:00 AM - 6:00 PM" },
];

const socialLinks = [
  { icon: Instagram, label: "Instagram", href: BRAND.instagram },
  { icon: Facebook, label: "Facebook", href: BRAND.facebook },
  { icon: Youtube, label: "YouTube", href: BRAND.youtube },
];

const inputClasses =
  "w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClasses = "mb-1.5 block text-sm font-medium text-foreground/80";
const errorClasses = "mt-1 text-xs text-red-400";

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
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
    // Simulate API call
    console.log("Form submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-lg rounded-lg border border-border bg-surface p-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Inquiry Received
          </h2>
          <p className="mt-4 text-muted">
            Thank you for your interest in {BRAND.name}. Our concierge team
            will review your inquiry and get back to you within 24 hours.
          </p>
          <p className="mt-2 text-sm text-muted/70">
            For urgent requests, call us directly at{" "}
            <a href={`tel:${BRAND.phone.replace(/\D/g, "")}`} className="text-primary hover:text-primary-light">
              {BRAND.phone}
            </a>
          </p>
          <Button
            className="mt-8"
            onClick={() => setIsSubmitted(false)}
          >
            Submit Another Inquiry
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      {/* Hero */}
      <section className="relative flex items-center justify-center bg-gradient-to-b from-navy via-background to-background pt-20">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" variants={stagger}>
            <motion.p
              variants={fadeUp}
              custom={0}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              Get in Touch
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={1}
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Plan Your{" "}
              <span className="text-brand-gradient">Perfect Charter</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={2}
              className="mx-auto mt-4 max-w-xl text-muted"
            >
              Tell us about your dream experience and our concierge team will
              craft a custom itinerary just for you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Form + Sidebar */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* Form - 2 columns */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="lg:col-span-2"
            >
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="rounded-lg border border-border bg-surface p-6 sm:p-8 lg:p-10">
                  <motion.h2
                    variants={fadeUp}
                    custom={0}
                    className="font-heading text-xl font-semibold text-foreground"
                  >
                    Charter Inquiry
                  </motion.h2>
                  <motion.p
                    variants={fadeUp}
                    custom={1}
                    className="mt-1 text-sm text-muted"
                  >
                    All fields marked with * are required.
                  </motion.p>

                  <div className="mt-8 space-y-6">
                    {/* Name row */}
                    <motion.div
                      variants={fadeUp}
                      custom={2}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div>
                        <label htmlFor="firstName" className={labelClasses}>
                          First Name *
                        </label>
                        <input
                          id="firstName"
                          type="text"
                          className={inputClasses}
                          placeholder="John"
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
                          className={inputClasses}
                          placeholder="Doe"
                          {...register("lastName")}
                        />
                        {errors.lastName && (
                          <p className={errorClasses}>{errors.lastName.message}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Email + Phone */}
                    <motion.div
                      variants={fadeUp}
                      custom={3}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div>
                        <label htmlFor="email" className={labelClasses}>
                          Email Address *
                        </label>
                        <input
                          id="email"
                          type="email"
                          className={inputClasses}
                          placeholder="john@example.com"
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
                          className={inputClasses}
                          placeholder="(305) 555-0199"
                          {...register("phone")}
                        />
                        {errors.phone && (
                          <p className={errorClasses}>{errors.phone.message}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Date + Party Size */}
                    <motion.div
                      variants={fadeUp}
                      custom={4}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div>
                        <label htmlFor="preferredDate" className={labelClasses}>
                          Preferred Date *
                        </label>
                        <input
                          id="preferredDate"
                          type="date"
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
                          className={inputClasses}
                          placeholder="12"
                          {...register("partySize")}
                        />
                        {errors.partySize && (
                          <p className={errorClasses}>{errors.partySize.message}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Charter Type + Occasion */}
                    <motion.div
                      variants={fadeUp}
                      custom={5}
                      className="grid gap-4 sm:grid-cols-2"
                    >
                      <div>
                        <label htmlFor="charterType" className={labelClasses}>
                          Charter Type *
                        </label>
                        <select
                          id="charterType"
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
                          <p className={errorClasses}>
                            {errors.charterType.message}
                          </p>
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
                          placeholder="Birthday, Corporate, Wedding..."
                          {...register("occasion")}
                        />
                        {errors.occasion && (
                          <p className={errorClasses}>{errors.occasion.message}</p>
                        )}
                      </div>
                    </motion.div>

                    {/* Add-ons checkboxes */}
                    <motion.div variants={fadeUp} custom={6}>
                      <p className={labelClasses}>Add-Ons (optional)</p>
                      <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {ADD_ONS.map((addon) => (
                          <label
                            key={addon.id}
                            className="flex cursor-pointer items-center gap-2.5 rounded-sm border border-border bg-background px-3 py-2.5 text-sm text-foreground/80 transition-colors duration-200 hover:border-primary/30 has-[:checked]:border-primary/50 has-[:checked]:bg-primary/5"
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
                    </motion.div>

                    {/* Message */}
                    <motion.div variants={fadeUp} custom={7}>
                      <label htmlFor="message" className={labelClasses}>
                        Additional Details
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className={inputClasses + " resize-y"}
                        placeholder="Tell us more about your ideal charter experience, special requests, dietary needs, or any questions you have..."
                        {...register("message")}
                      />
                      {errors.message && (
                        <p className={errorClasses}>{errors.message.message}</p>
                      )}
                    </motion.div>

                    {/* Submit */}
                    <motion.div variants={fadeUp} custom={8}>
                      <Button
                        type="submit"
                        size="lg"
                        className="w-full sm:w-auto"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <svg
                              className="h-4 w-4 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Sending...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Send className="h-4 w-4" />
                            Submit Inquiry
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </form>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="space-y-6"
            >
              {/* Contact Info */}
              <motion.div
                variants={fadeUp}
                custom={0}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Contact Information
                </h3>
                <div className="mt-5 space-y-4">
                  {contactInfo.map((item) => (
                    <a
                      key={item.label}
                      href={item.href}
                      target={item.label === "Address" ? "_blank" : undefined}
                      rel={item.label === "Address" ? "noopener noreferrer" : undefined}
                      className="flex items-start gap-3 text-sm text-muted transition-colors duration-200 hover:text-primary"
                    >
                      <item.icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                      <span>{item.value}</span>
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                variants={fadeUp}
                custom={1}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                  <Clock className="h-4 w-4 text-primary" />
                  Business Hours
                </h3>
                <div className="mt-5 space-y-3">
                  {businessHours.map((item) => (
                    <div
                      key={item.days}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted">{item.days}</span>
                      <span className="font-medium text-foreground/80">
                        {item.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={fadeUp}
                custom={2}
                className="rounded-lg border border-border bg-surface p-6"
              >
                <h3 className="font-heading text-lg font-semibold text-foreground">
                  Follow Us
                </h3>
                <div className="mt-5 flex gap-3">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      className="flex h-10 w-10 items-center justify-center rounded-sm border border-border bg-background text-muted transition-all duration-200 hover:border-primary/30 hover:text-primary"
                    >
                      <link.icon className="h-4 w-4" />
                    </a>
                  ))}
                </div>
              </motion.div>

              {/* Quick note */}
              <motion.div
                variants={fadeUp}
                custom={3}
                className="rounded-lg border border-primary/20 bg-primary/5 p-6"
              >
                <p className="text-sm font-medium text-primary-light">
                  Need an immediate response?
                </p>
                <p className="mt-2 text-sm text-muted">
                  Call us directly for same-day availability and last-minute
                  bookings. Our team is standing by.
                </p>
                <a
                  href={`tel:${BRAND.phone.replace(/\D/g, "")}`}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-primary-light"
                >
                  <Phone className="h-4 w-4" />
                  {BRAND.phone}
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
