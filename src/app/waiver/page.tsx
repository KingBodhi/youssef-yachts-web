"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod/v4";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRAND } from "@/lib/constants";

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

const waiverSections = [
  {
    icon: AlertTriangle,
    title: "1. Assumption of Risk",
    content:
      'I acknowledge that participating in yacht charter activities involves inherent risks, including but not limited to: drowning, slipping, falling, sunburn, seasickness, marine life encounters, equipment malfunction, and adverse weather conditions. I voluntarily assume all risks, known and unknown, associated with participating in this charter, including travel to and from the vessel. I understand that conditions on the water can change rapidly and agree to follow all safety instructions given by the captain and crew at all times.',
  },
  {
    icon: Shield,
    title: "2. Release of Liability",
    content:
      `I, on behalf of myself, my heirs, executors, administrators, and assigns, hereby release, waive, and forever discharge ${BRAND.name}, its owners, operators, employees, agents, captains, and crew members from any and all liability, claims, demands, actions, and causes of action whatsoever arising out of or related to any loss, damage, or injury, including death, that may be sustained by me or any property belonging to me, whether caused by the negligence of the releasees or otherwise, while participating in charter activities.`,
  },
  {
    icon: Heart,
    title: "3. Medical Acknowledgment",
    content:
      "I certify that I am in good physical health and have no medical conditions that would prevent my safe participation in yacht charter activities. I understand that it is my responsibility to inform the captain of any medical conditions, disabilities, allergies, or medications that may affect my participation or require emergency attention. I authorize emergency medical treatment at my own expense if necessary. I understand that medical facilities may not be immediately accessible while on the water.",
  },
  {
    icon: Wine,
    title: "4. Alcohol & Substance Policy",
    content:
      `I understand that the consumption of alcoholic beverages on the vessel is permitted for guests 21 years of age and older. I acknowledge that excessive alcohol consumption increases the risk of injury and may impair judgment. I agree not to consume illegal substances aboard the vessel. I understand that the captain reserves the right to refuse service, limit alcohol consumption, or terminate the charter if any guest's behavior, due to intoxication or otherwise, poses a safety risk to themselves, other guests, or the crew. No refund will be issued in such cases.`,
  },
  {
    icon: DollarSign,
    title: "5. Property Damage",
    content:
      `I agree to be held financially responsible for any damage to the vessel, its equipment, furnishings, or any property of ${BRAND.name} caused by my willful misconduct, negligence, or failure to follow the captain's instructions. This includes but is not limited to: damage to upholstery, electronics, water toys, hull, and engine components. I agree to report any damage immediately to the captain. A damage assessment will be conducted at the conclusion of the charter, and repair or replacement costs will be billed accordingly.`,
  },
  {
    icon: Siren,
    title: "6. Emergency Medical Authorization",
    content:
      "In the event of a medical emergency, I authorize the captain and crew to administer basic first aid and to contact emergency medical services on my behalf. I understand and agree that any medical expenses incurred as a result of an emergency during the charter are my sole financial responsibility. I consent to being transported to the nearest medical facility if deemed necessary by the captain or emergency responders. I release the captain and crew from any liability related to emergency medical decisions made in good faith.",
  },
  {
    icon: Camera,
    title: "7. Photo & Video Release",
    content:
      `I grant ${BRAND.name}, its employees, and its affiliates the irrevocable right to use any photographs, video recordings, or other media taken during my charter for promotional, marketing, advertising, and editorial purposes across all media platforms, including but not limited to: website, social media, print, and digital advertising. I waive any right to compensation, inspection, or approval of the finished materials. I understand I may request to opt out of this clause by notifying the captain in writing prior to departure.`,
  },
  {
    icon: Scale,
    title: "8. Governing Law & Jurisdiction",
    content:
      "This waiver and release shall be governed by and construed in accordance with the laws of the State of Florida and applicable federal maritime law. Any disputes arising from this agreement or the charter activities shall be resolved exclusively in the state or federal courts located in Miami-Dade County, Florida. If any provision of this waiver is found to be unenforceable, the remaining provisions shall remain in full force and effect. This waiver constitutes the entire agreement between the parties regarding the subject matter herein.",
  },
];

const waiverSchema = z.object({
  fullName: z.string().min(2, "Full name is required").max(100),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.email("Please enter a valid email address"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^[\d\s\-\+\(\)]{7,20}$/, "Please enter a valid phone number"),
  emergencyContactName: z
    .string()
    .min(2, "Emergency contact name is required")
    .max(100),
  emergencyContactPhone: z
    .string()
    .min(1, "Emergency contact phone is required")
    .regex(/^[\d\s\-\+\(\)]{7,20}$/, "Please enter a valid phone number"),
  emergencyContactRelation: z
    .string()
    .min(1, "Relationship is required")
    .max(50),
  agreedToTerms: z.literal(true, {
    error: "You must agree to the terms and conditions",
  }),
  typedSignature: z
    .string()
    .min(2, "Please type your full legal name as a signature")
    .max(100),
});

type WaiverFormData = z.infer<typeof waiverSchema>;

const inputClasses =
  "w-full rounded-sm border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted/60 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClasses = "mb-1.5 block text-sm font-medium text-foreground/80";
const errorClasses = "mt-1 text-xs text-red-400";

export default function WaiverPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaiverFormData>({
    resolver: zodResolver(waiverSchema),
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
    console.log("Waiver submitted:", data);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            Your digital waiver has been recorded. A confirmation copy has been
            sent to the email address you provided.
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
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Legal Sections */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={stagger}
              className="space-y-6"
            >
              {waiverSections.map((section, i) => (
                <motion.div
                  key={section.title}
                  variants={fadeUp}
                  custom={i}
                  className="rounded-lg border border-border bg-surface p-6 sm:p-8"
                >
                  <div className="mb-4 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <section.icon className="h-5 w-5" />
                    </div>
                    <h2 className="pt-1.5 font-heading text-lg font-semibold text-foreground">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-sm leading-relaxed text-muted">
                    {section.content}
                  </p>
                </motion.div>
              ))}
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
                    <label
                      htmlFor="typedSignature"
                      className={labelClasses}
                    >
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
                    <span className="font-medium text-foreground/70">
                      Date:
                    </span>
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

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
