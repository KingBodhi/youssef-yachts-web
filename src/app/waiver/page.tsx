"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  Heart,
  Wine,
  DollarSign,
  Siren,
  Camera,
  Scale,
  CheckCircle,
  FileText,
  Anchor,
  AlertCircle,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { waiverSections } from "@/lib/waiver-content";
import { waiverFormSchema, type WaiverFormData } from "@/lib/schemas";

const SECTION_ICONS: Record<string, LucideIcon> = {
  "assumption-of-risk": AlertTriangle,
  "release-of-liability": Shield,
  medical: Heart,
  alcohol: Wine,
  "property-damage": DollarSign,
  emergency: Siren,
  "photo-video": Camera,
  "governing-law": Scale,
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0, 0, 0.2, 1] as const },
  }),
};

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const inputClasses =
  "w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClasses = "mb-1.5 block text-sm font-medium text-foreground/80";
const errorClasses = "mt-1 text-xs text-red-400";

function WaiverForm() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking") ?? undefined;
  const token = searchParams.get("token") ?? undefined;

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaiverFormData>({
    resolver: zodResolver(waiverFormSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      emergencyContactName: "",
      emergencyContactPhone: "",
      emergencyContactRelation: "",
      agreedToTerms: undefined,
      typedSignature: "",
    },
  });

  const onSubmit = async (data: WaiverFormData) => {
    setSubmitError("");
    try {
      const res = await fetch("/api/waivers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, bookingId, token }),
      });

      if (res.status === 403) {
        setSubmitError(
          "This signing link is invalid or has expired. Please request a new link from Hurry Up Slowly."
        );
        return;
      }
      if (!res.ok) {
        setSubmitError(
          "We couldn't submit your waiver. Please try again or contact us."
        );
        return;
      }

      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "Something went wrong. Please check your connection and try again."
      );
    }
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
            Waiver Signed Successfully
          </h2>
          <p className="mt-4 text-muted">
            Your waiver has been recorded and a signed PDF has been saved for our
            records. Each additional guest must complete their own waiver before
            boarding.
          </p>

          <div className="mt-8 rounded-lg border border-primary/20 bg-primary/5 p-6 text-left">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary-light">
              Reminders for Charter Day
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-muted">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Arrive 15-20 minutes before your scheduled departure
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Bring reef-safe sunscreen, sunglasses, and swimwear
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Wear non-marking shoes on deck
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Inform the captain of any medical conditions
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                All guests must be present for the safety briefing
              </li>
            </ul>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/contact">Contact Us</a>
            </Button>
          </div>
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
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10"
            >
              <FileText className="h-7 w-7 text-primary" />
            </motion.div>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light"
            >
              Required Before Boarding
            </motion.p>
            <motion.h1
              variants={fadeUp}
              custom={2}
              className="font-heading text-4xl font-bold tracking-tight text-foreground sm:text-5xl"
            >
              Digital{" "}
              <span className="text-brand-gradient">Liability Waiver</span>
            </motion.h1>
            <motion.p
              variants={fadeUp}
              custom={3}
              className="mx-auto mt-4 max-w-2xl text-muted"
            >
              Please read each section carefully before signing. All guests aged
              18 and older must complete this waiver prior to boarding. Minors
              must have a parent or legal guardian sign on their behalf.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Waiver Form */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          {bookingId && (
            <div className="mb-8 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-light">
              <Anchor className="h-4 w-4 shrink-0" />
              You are signing for charter{" "}
              <span className="font-semibold">{bookingId}</span>.
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Legal Sections */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="space-y-6"
            >
              {waiverSections.map((section, i) => {
                const Icon = SECTION_ICONS[section.id] ?? FileText;
                return (
                  <motion.div
                    key={section.id}
                    variants={fadeUp}
                    custom={i}
                    className="rounded-lg border border-border bg-surface p-6 sm:p-8"
                  >
                    <div className="mb-4 flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="pt-1.5 font-heading text-lg font-semibold text-foreground">
                        {section.title}
                      </h2>
                    </div>
                    <p className="text-sm leading-relaxed text-muted">
                      {section.content}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Personal Information */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mt-12"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Personal Information
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded bg-primary" />
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                className="rounded-lg border border-border bg-surface p-6 sm:p-8"
              >
                <div className="space-y-5">
                  {/* Full Name + DOB */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="fullName" className={labelClasses}>
                        Full Legal Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        className={inputClasses}
                        placeholder="John Michael Doe"
                        {...register("fullName")}
                      />
                      {errors.fullName && (
                        <p className={errorClasses}>{errors.fullName.message}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="dateOfBirth" className={labelClasses}>
                        Date of Birth *
                      </label>
                      <input
                        id="dateOfBirth"
                        type="date"
                        className={inputClasses}
                        {...register("dateOfBirth")}
                      />
                      {errors.dateOfBirth && (
                        <p className={errorClasses}>
                          {errors.dateOfBirth.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Email + Phone */}
                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Emergency Contact */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mt-12"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Emergency Contact
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded bg-primary" />
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                className="rounded-lg border border-border bg-surface p-6 sm:p-8"
              >
                <div className="space-y-5">
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <label
                        htmlFor="emergencyContactName"
                        className={labelClasses}
                      >
                        Contact Name *
                      </label>
                      <input
                        id="emergencyContactName"
                        type="text"
                        className={inputClasses}
                        placeholder="Jane Doe"
                        {...register("emergencyContactName")}
                      />
                      {errors.emergencyContactName && (
                        <p className={errorClasses}>
                          {errors.emergencyContactName.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="emergencyContactPhone"
                        className={labelClasses}
                      >
                        Contact Phone *
                      </label>
                      <input
                        id="emergencyContactPhone"
                        type="tel"
                        className={inputClasses}
                        placeholder="(305) 555-0100"
                        {...register("emergencyContactPhone")}
                      />
                      {errors.emergencyContactPhone && (
                        <p className={errorClasses}>
                          {errors.emergencyContactPhone.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor="emergencyContactRelation"
                        className={labelClasses}
                      >
                        Relationship *
                      </label>
                      <input
                        id="emergencyContactRelation"
                        type="text"
                        className={inputClasses}
                        placeholder="Spouse, Parent, Sibling..."
                        {...register("emergencyContactRelation")}
                      />
                      {errors.emergencyContactRelation && (
                        <p className={errorClasses}>
                          {errors.emergencyContactRelation.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Agreement & Signature */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
              className="mt-12"
            >
              <motion.div variants={fadeUp} custom={0} className="mb-6">
                <h2 className="font-heading text-xl font-semibold text-foreground">
                  Agreement & Signature
                </h2>
                <div className="mt-2 h-0.5 w-12 rounded bg-primary" />
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={1}
                className="rounded-lg border border-border bg-surface p-6 sm:p-8"
              >
                <div className="space-y-6">
                  {/* Checkbox */}
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      className="mt-1 h-5 w-5 shrink-0 rounded border-border bg-surface accent-primary"
                      {...register("agreedToTerms")}
                    />
                    <span className="text-sm leading-relaxed text-muted">
                      I have read, understood, and agree to all terms and
                      conditions outlined in this liability waiver. I
                      acknowledge that this is a legally binding document and
                      that I am signing it voluntarily. I confirm that I am at
                      least 18 years of age or am the parent/legal guardian of a
                      participating minor.
                    </span>
                  </label>
                  {errors.agreedToTerms && (
                    <p className={errorClasses}>
                      {errors.agreedToTerms.message}
                    </p>
                  )}

                  {/* Typed Signature */}
                  <div>
                    <label htmlFor="typedSignature" className={labelClasses}>
                      Typed Signature (Full Legal Name) *
                    </label>
                    <p className="mb-2 text-xs text-muted/70">
                      By typing your name below, you acknowledge that this
                      constitutes a legal electronic signature.
                    </p>
                    <input
                      id="typedSignature"
                      type="text"
                      className={`${inputClasses} font-heading text-lg italic`}
                      placeholder="Your full legal name"
                      {...register("typedSignature")}
                    />
                    {errors.typedSignature && (
                      <p className={errorClasses}>
                        {errors.typedSignature.message}
                      </p>
                    )}
                  </div>

                  {/* Date display */}
                  <div className="flex items-center gap-2 text-sm text-muted">
                    <span className="font-medium text-foreground/70">Date:</span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {submitError && (
                    <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      {submitError}
                    </div>
                  )}

                  {/* Submit */}
                  <div className="pt-2">
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
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Anchor className="h-4 w-4" />
                          Sign & Submit Waiver
                        </span>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </form>
        </div>
      </section>
    </div>
  );
}

export default function WaiverPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      }
    >
      <WaiverForm />
    </Suspense>
  );
}
