"use client";

import { useState, useCallback, useMemo, forwardRef } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  Users,
  ChefHat,
  Music,
  Camera,
  Waves,
  Anchor,
  Sparkles,
  Plus,
  Minus,
  ArrowLeft,
  ArrowRight,
  Check,
  Ship,
  CreditCard,
  Mail,
  Phone,
  User,
  MessageSquare,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { PriceSummary } from "@/components/booking/price-summary";
import { CHARTER_TYPES, ADD_ONS } from "@/lib/constants";
import { createBooking } from "@/lib/bookings";
import type { Yacht } from "@/lib/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface BookingFormData {
  date: string;
  charterType: "half-day" | "full-day" | "multi-day";
  timeSlot: string;
  guests: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialRequests: string;
  addOns: string[];
}

const TIME_SLOTS = [
  { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM" },
  { id: "afternoon", label: "Afternoon", time: "1:00 PM - 5:00 PM" },
  { id: "sunset", label: "Sunset", time: "4:00 PM - 8:00 PM" },
  { id: "full-day", label: "Full Day", time: "9:00 AM - 5:00 PM" },
] as const;

const ADDON_ICONS: Record<string, React.ElementType> = {
  "chef-hat": ChefHat,
  music: Music,
  camera: Camera,
  waves: Waves,
  anchor: Anchor,
  sparkles: Sparkles,
};

// ---------------------------------------------------------------------------
// Slide animation variants
// ---------------------------------------------------------------------------

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 300 : -300,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 300 : -300,
    opacity: 0,
  }),
};

const slideTransition = {
  x: { type: "spring" as const, stiffness: 300, damping: 30 },
  opacity: { duration: 0.25 },
};

// ---------------------------------------------------------------------------
// Helpers for price calculation
// ---------------------------------------------------------------------------

function getBasePrice(yacht: Yacht, charterType: string): number {
  return charterType === "half-day"
    ? yacht.pricing.halfDay
    : charterType === "full-day"
      ? yacht.pricing.fullDay
      : (yacht.pricing.multiDayPerDay ?? yacht.pricing.fullDay);
}

function getTimeSlotTimes(slotId: string): { start: string; end: string } {
  switch (slotId) {
    case "morning":
      return { start: "08:00", end: "12:00" };
    case "afternoon":
      return { start: "13:00", end: "17:00" };
    case "sunset":
      return { start: "16:00", end: "20:00" };
    case "full-day":
      return { start: "09:00", end: "17:00" };
    default:
      return { start: "09:00", end: "17:00" };
  }
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export function BookingFlow({ yacht }: { yacht: Yacht }) {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BookingFormData>({
    defaultValues: {
      date: "",
      charterType: "half-day",
      timeSlot: "morning",
      guests: 2,
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      specialRequests: "",
      addOns: [],
    },
    mode: "onTouched",
  });

  const watchAll = watch();

  // Derive selected add-on objects
  const selectedAddOns = useMemo(
    () => ADD_ONS.filter((a) => watchAll.addOns.includes(a.id)),
    [watchAll.addOns]
  );

  // Filterable time slots depending on charter type
  const availableTimeSlots = useMemo(() => {
    if (watchAll.charterType === "full-day" || watchAll.charterType === "multi-day") {
      return TIME_SLOTS.filter((s) => s.id === "full-day");
    }
    return TIME_SLOTS.filter((s) => s.id !== "full-day");
  }, [watchAll.charterType]);

  // Auto-select correct time slot when charter type changes
  const handleCharterTypeChange = useCallback(
    (type: "half-day" | "full-day" | "multi-day") => {
      setValue("charterType", type);
      if (type === "full-day" || type === "multi-day") {
        setValue("timeSlot", "full-day");
      } else if (watchAll.timeSlot === "full-day") {
        setValue("timeSlot", "morning");
      }
    },
    [setValue, watchAll.timeSlot]
  );

  // Step validation
  const validateStep = useCallback(
    async (currentStep: number): Promise<boolean> => {
      switch (currentStep) {
        case 1:
          return trigger(["date", "charterType", "timeSlot"]);
        case 2:
          return trigger(["firstName", "lastName", "email", "phone", "guests"]);
        case 3:
          return true;
        default:
          return true;
      }
    },
    [trigger]
  );

  const goNext = useCallback(async () => {
    const valid = await validateStep(step);
    if (!valid) return;
    setDirection(1);
    setStep((s) => Math.min(s + 1, 4));
  }, [step, validateStep]);

  const goBack = useCallback(() => {
    setDirection(-1);
    setStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(() => {
    const data = watchAll;
    const basePrice = getBasePrice(yacht, data.charterType);
    const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
    const subtotal = basePrice + addOnsTotal;
    const serviceFee = Math.round(subtotal * 0.1);
    const tax = Math.round(subtotal * 0.07);
    const total = subtotal + serviceFee + tax;
    const deposit = Math.round(total * 0.5);
    const times = getTimeSlotTimes(data.timeSlot);

    createBooking({
      yachtId: yacht.id,
      customerInfo: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        specialRequests: data.specialRequests || undefined,
      },
      schedule: {
        date: data.date,
        startTime: times.start,
        endTime: times.end,
        type: data.charterType,
      },
      guests: data.guests,
      addOns: data.addOns,
      pricing: {
        basePrice,
        addOnsTotal,
        serviceFee,
        tax,
        total,
        deposit,
        balance: total - deposit,
      },
      payment: {
        method: "card",
        status: "deposit_paid",
        paidAmount: deposit,
        remainingAmount: total - deposit,
      },
      status: "deposit_paid",
      notes: data.specialRequests || undefined,
    });

    setIsSubmitted(true);
  }, [watchAll, yacht, selectedAddOns]);

  // Toggle add-on
  const toggleAddOn = useCallback(
    (id: string) => {
      const current = watchAll.addOns;
      if (current.includes(id)) {
        setValue(
          "addOns",
          current.filter((a) => a !== id)
        );
      } else {
        setValue("addOns", [...current, id]);
      }
    },
    [watchAll.addOns, setValue]
  );

  // Guest stepper
  const incrementGuests = useCallback(() => {
    if (watchAll.guests < yacht.capacity) {
      setValue("guests", watchAll.guests + 1);
    }
  }, [watchAll.guests, yacht.capacity, setValue]);

  const decrementGuests = useCallback(() => {
    if (watchAll.guests > 1) {
      setValue("guests", watchAll.guests - 1);
    }
  }, [watchAll.guests, setValue]);

  if (isSubmitted) {
    return <SuccessState yacht={yacht} data={watchAll} />;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      {/* Left -- Steps */}
      <div className="min-w-0">
        {/* Yacht badge */}
        <div className="mb-8 flex items-center gap-4">
          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-navy-light">
            <Image
              src={yacht.heroImage}
              alt={yacht.name}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold text-foreground">
              {yacht.name}
            </h1>
            <p className="text-sm text-muted">{yacht.tagline}</p>
          </div>
        </div>

        {/* Inline progress bar */}
        <div className="mb-8 flex items-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-semibold transition-all duration-300",
                  s < step
                    ? "border-primary bg-primary text-white"
                    : s === step
                      ? "border-primary text-primary"
                      : "border-white/10 text-white/30"
                )}
              >
                {s < step ? <Check className="h-4 w-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 rounded-full transition-colors duration-300",
                    s < step ? "bg-primary" : "bg-white/10"
                  )}
                />
              )}
            </div>
          ))}
        </div>

        {/* Animated step content */}
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
            >
              {step === 1 && (
                <StepDateTime
                  register={register}
                  control={control}
                  errors={errors}
                  watchAll={watchAll}
                  yacht={yacht}
                  availableTimeSlots={availableTimeSlots}
                  onCharterTypeChange={handleCharterTypeChange}
                  setValue={setValue}
                />
              )}
              {step === 2 && (
                <StepGuestDetails
                  register={register}
                  errors={errors}
                  watchAll={watchAll}
                  yacht={yacht}
                  incrementGuests={incrementGuests}
                  decrementGuests={decrementGuests}
                />
              )}
              {step === 3 && (
                <StepCustomize
                  watchAll={watchAll}
                  toggleAddOn={toggleAddOn}
                />
              )}
              {step === 4 && (
                <StepReview
                  yacht={yacht}
                  watchAll={watchAll}
                  selectedAddOns={selectedAddOns}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button
            variant="ghost"
            size="lg"
            onClick={goBack}
            disabled={step === 1}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {step < 4 ? (
            <Button size="lg" onClick={goNext} className="gap-2">
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={handleSubmit} className="gap-2">
              <CreditCard className="h-4 w-4" /> Confirm &amp; Pay Deposit
            </Button>
          )}
        </div>
      </div>

      {/* Right -- Sticky Price Summary */}
      <div className="hidden lg:block">
        <div className="sticky top-8">
          <PriceSummary
            yacht={yacht}
            date={watchAll.date}
            charterType={watchAll.charterType}
            timeSlot={
              availableTimeSlots.find((s) => s.id === watchAll.timeSlot)?.time ??
              ""
            }
            guests={watchAll.guests}
            selectedAddOns={selectedAddOns}
          />
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 1 -- Date & Time
// ===========================================================================

function StepDateTime({
  register,
  errors,
  watchAll,
  yacht,
  availableTimeSlots,
  onCharterTypeChange,
  setValue,
}: {
  register: ReturnType<typeof useForm<BookingFormData>>["register"];
  control: ReturnType<typeof useForm<BookingFormData>>["control"];
  errors: ReturnType<typeof useForm<BookingFormData>>["formState"]["errors"];
  watchAll: BookingFormData;
  yacht: Yacht;
  availableTimeSlots: readonly { id: string; label: string; time: string }[];
  onCharterTypeChange: (type: "half-day" | "full-day" | "multi-day") => void;
  setValue: ReturnType<typeof useForm<BookingFormData>>["setValue"];
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-3xl font-semibold text-foreground">
          Select Date &amp; Time
        </h2>
        <p className="mt-2 text-muted">
          Choose your preferred charter date, duration, and departure time.
        </p>
      </div>

      {/* Date picker */}
      <div>
        <label className="mb-2 block text-sm font-medium tracking-wide text-foreground/80">
          <Calendar className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          Charter Date
        </label>
        <input
          type="date"
          {...register("date", { required: "Please select a date" })}
          min={new Date().toISOString().split("T")[0]}
          className={cn(
            "w-full max-w-sm rounded-md border bg-navy-light px-4 py-3 text-foreground outline-none transition-colors",
            "focus:border-primary focus:ring-1 focus:ring-primary/40",
            "[color-scheme:dark]",
            errors.date ? "border-red-500" : "border-border"
          )}
        />
        {errors.date && (
          <p className="mt-1.5 text-sm text-red-400">{errors.date.message}</p>
        )}
      </div>

      {/* Charter type */}
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wide text-foreground/80">
          <Clock className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          Charter Type
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {CHARTER_TYPES.map((type) => {
            const price =
              type.id === "half-day"
                ? yacht.pricing.halfDay
                : type.id === "full-day"
                  ? yacht.pricing.fullDay
                  : (yacht.pricing.multiDayPerDay ?? yacht.pricing.fullDay);
            const isActive = watchAll.charterType === type.id;

            return (
              <button
                type="button"
                key={type.id}
                onClick={() =>
                  onCharterTypeChange(
                    type.id as "half-day" | "full-day" | "multi-day"
                  )
                }
                className={cn(
                  "group relative rounded-lg border p-5 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                    : "border-border bg-navy-light/50 hover:border-primary/30 hover:bg-navy-light"
                )}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className={cn(
                        "font-semibold",
                        isActive ? "text-primary-light" : "text-foreground"
                      )}
                    >
                      {type.label}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">{type.duration}</p>
                  </div>
                  <div
                    className={cn(
                      "flex h-5 w-5 items-center justify-center rounded-full border-2 transition-colors",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-white/20 bg-transparent"
                    )}
                  >
                    {isActive && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted">{type.description}</p>
                <p className="mt-3 font-heading text-lg font-semibold text-primary-light">
                  {formatCurrency(price)}
                  <span className="text-xs font-normal text-muted">
                    {type.id === "multi-day" ? "/day" : ""}
                  </span>
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Time slots */}
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wide text-foreground/80">
          <Clock className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          Time Slot
        </label>
        <div className="grid gap-3 sm:grid-cols-3">
          {availableTimeSlots.map((slot) => {
            const isActive = watchAll.timeSlot === slot.id;
            return (
              <button
                type="button"
                key={slot.id}
                onClick={() => setValue("timeSlot", slot.id)}
                className={cn(
                  "rounded-lg border px-5 py-4 text-left transition-all duration-200",
                  isActive
                    ? "border-primary bg-primary/5"
                    : "border-border bg-navy-light/50 hover:border-primary/30 hover:bg-navy-light"
                )}
              >
                <p
                  className={cn(
                    "font-semibold",
                    isActive ? "text-primary-light" : "text-foreground"
                  )}
                >
                  {slot.label}
                </p>
                <p className="mt-0.5 text-xs text-muted">{slot.time}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Step 2 -- Guest Details
// ===========================================================================

function StepGuestDetails({
  register,
  errors,
  watchAll,
  yacht,
  incrementGuests,
  decrementGuests,
}: {
  register: ReturnType<typeof useForm<BookingFormData>>["register"];
  errors: ReturnType<typeof useForm<BookingFormData>>["formState"]["errors"];
  watchAll: BookingFormData;
  yacht: Yacht;
  incrementGuests: () => void;
  decrementGuests: () => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-3xl font-semibold text-foreground">
          Guest Details
        </h2>
        <p className="mt-2 text-muted">
          Tell us about your party so we can prepare the perfect experience.
        </p>
      </div>

      {/* Party size stepper */}
      <div>
        <label className="mb-3 block text-sm font-medium tracking-wide text-foreground/80">
          <Users className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          Party Size
          <span className="ml-2 text-xs text-muted">
            (Max {yacht.capacity} guests)
          </span>
        </label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={decrementGuests}
            disabled={watchAll.guests <= 1}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg border transition-colors",
              watchAll.guests <= 1
                ? "cursor-not-allowed border-white/5 text-white/20"
                : "border-border bg-navy-light text-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            <Minus className="h-5 w-5" />
          </button>
          <span className="font-heading text-4xl font-bold text-primary tabular-nums">
            {watchAll.guests}
          </span>
          <button
            type="button"
            onClick={incrementGuests}
            disabled={watchAll.guests >= yacht.capacity}
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-lg border transition-colors",
              watchAll.guests >= yacht.capacity
                ? "cursor-not-allowed border-white/5 text-white/20"
                : "border-border bg-navy-light text-foreground hover:border-primary/40 hover:text-primary"
            )}
          >
            <Plus className="h-5 w-5" />
          </button>
          <span className="text-sm text-muted">
            {watchAll.guests === 1 ? "guest" : "guests"}
          </span>
        </div>
      </div>

      {/* Contact info */}
      <div className="grid gap-5 sm:grid-cols-2">
        <InputField
          label="First Name"
          icon={User}
          error={errors.firstName?.message}
          {...register("firstName", { required: "First name is required" })}
        />
        <InputField
          label="Last Name"
          icon={User}
          error={errors.lastName?.message}
          {...register("lastName", { required: "Last name is required" })}
        />
        <InputField
          label="Email"
          icon={Mail}
          type="email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
        />
        <InputField
          label="Phone"
          icon={Phone}
          type="tel"
          error={errors.phone?.message}
          {...register("phone", { required: "Phone number is required" })}
        />
      </div>

      {/* Special requests */}
      <div>
        <label className="mb-2 block text-sm font-medium tracking-wide text-foreground/80">
          <MessageSquare className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          Special Requests
          <span className="ml-2 text-xs text-muted">(optional)</span>
        </label>
        <textarea
          {...register("specialRequests")}
          rows={4}
          placeholder="Birthdays, anniversaries, dietary needs, preferred routes..."
          className="w-full rounded-md border border-border bg-navy-light px-4 py-3 text-sm text-foreground placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40"
        />
      </div>
    </div>
  );
}

// ===========================================================================
// Step 3 -- Customize (Add-ons)
// ===========================================================================

function StepCustomize({
  watchAll,
  toggleAddOn,
}: {
  watchAll: BookingFormData;
  toggleAddOn: (id: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-3xl font-semibold text-foreground">
          Customize Your Charter
        </h2>
        <p className="mt-2 text-muted">
          Elevate your experience with premium add-ons. Select as many as you
          like.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {ADD_ONS.map((addon) => {
          const isSelected = watchAll.addOns.includes(addon.id);
          const Icon = ADDON_ICONS[addon.icon] ?? Sparkles;

          return (
            <motion.button
              key={addon.id}
              type="button"
              onClick={() => toggleAddOn(addon.id)}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative rounded-lg border p-5 text-left transition-all duration-200",
                isSelected
                  ? "border-primary bg-primary/5 shadow-md shadow-primary/10"
                  : "border-border bg-navy-light/50 hover:border-primary/30 hover:bg-navy-light"
              )}
            >
              {/* Selected indicator */}
              <div
                className={cn(
                  "absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 transition-all",
                  isSelected
                    ? "border-primary bg-primary"
                    : "border-white/20 bg-transparent"
                )}
              >
                {isSelected && <Check className="h-3.5 w-3.5 text-white" />}
              </div>

              <div className="flex items-start gap-4">
                <div
                  className={cn(
                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors",
                    isSelected ? "bg-primary/20 text-primary-light" : "bg-white/5 text-muted"
                  )}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div className="pr-6">
                  <p
                    className={cn(
                      "font-semibold transition-colors",
                      isSelected ? "text-primary-light" : "text-foreground"
                    )}
                  >
                    {addon.name}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted">
                    {addon.description}
                  </p>
                  <p className="mt-2 font-heading text-lg font-semibold text-primary/80">
                    {formatCurrency(addon.price)}
                  </p>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ===========================================================================
// Step 4 -- Review & Pay
// ===========================================================================

function StepReview({
  yacht,
  watchAll,
  selectedAddOns,
}: {
  yacht: Yacht;
  watchAll: BookingFormData;
  selectedAddOns: typeof ADD_ONS extends readonly (infer T)[] ? T[] : never;
}) {
  const basePrice = getBasePrice(yacht, watchAll.charterType);
  const addOnsTotal = selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const subtotal = basePrice + addOnsTotal;
  const serviceFee = Math.round(subtotal * 0.1);
  const tax = Math.round(subtotal * 0.07);
  const total = subtotal + serviceFee + tax;
  const deposit = Math.round(total * 0.5);

  const charterLabel =
    watchAll.charterType === "half-day"
      ? "Half Day (4 hrs)"
      : watchAll.charterType === "full-day"
        ? "Full Day (8 hrs)"
        : "Multi-Day";

  const timeSlotLabel =
    TIME_SLOTS.find((s) => s.id === watchAll.timeSlot)?.time ?? "";

  const formattedDate = watchAll.date
    ? new Date(watchAll.date + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "Not selected";

  return (
    <div className="space-y-10">
      <div>
        <h2 className="font-heading text-3xl font-semibold text-foreground">
          Review &amp; Pay
        </h2>
        <p className="mt-2 text-muted">
          Review your selections below. A 50% deposit secures your reservation.
        </p>
      </div>

      {/* Booking summary cards */}
      <div className="space-y-4">
        {/* Yacht & Schedule */}
        <div className="rounded-lg border border-border bg-navy-light/50 p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Charter Details
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryRow label="Yacht" value={yacht.name} />
            <SummaryRow label="Date" value={formattedDate} />
            <SummaryRow label="Charter Type" value={charterLabel} />
            <SummaryRow label="Time" value={timeSlotLabel} />
            <SummaryRow
              label="Guests"
              value={`${watchAll.guests} ${watchAll.guests === 1 ? "guest" : "guests"}`}
            />
            <SummaryRow label="Marina" value={yacht.location.marina} />
          </div>
        </div>

        {/* Guest info */}
        <div className="rounded-lg border border-border bg-navy-light/50 p-5">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Guest Information
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <SummaryRow
              label="Name"
              value={`${watchAll.firstName} ${watchAll.lastName}`}
            />
            <SummaryRow label="Email" value={watchAll.email} />
            <SummaryRow label="Phone" value={watchAll.phone} />
            {watchAll.specialRequests && (
              <div className="sm:col-span-2">
                <SummaryRow
                  label="Special Requests"
                  value={watchAll.specialRequests}
                />
              </div>
            )}
          </div>
        </div>

        {/* Add-ons */}
        {selectedAddOns.length > 0 && (
          <div className="rounded-lg border border-border bg-navy-light/50 p-5">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
              Add-Ons
            </h3>
            <div className="space-y-3">
              {selectedAddOns.map((addon) => (
                <div
                  key={addon.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-foreground">{addon.name}</span>
                  <span className="text-muted">
                    {formatCurrency(addon.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price breakdown -- visible on mobile (desktop has sidebar) */}
        <div className="rounded-lg border border-primary/20 bg-primary/5 p-5 lg:hidden">
          <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
            Price Breakdown
          </h3>
          <div className="space-y-3">
            <PriceRow label={charterLabel} amount={basePrice} />
            {selectedAddOns.map((a) => (
              <PriceRow key={a.id} label={a.name} amount={a.price} />
            ))}
            <div className="my-2 h-px bg-border" />
            <PriceRow label="Service Fee (10%)" amount={serviceFee} />
            <PriceRow label="Tax (7%)" amount={tax} />
            <div className="my-2 h-px bg-border" />
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-heading text-2xl font-bold text-primary">
                {formatCurrency(total)}
              </span>
            </div>
            <div className="mt-3 rounded-md border border-primary/20 bg-primary/5 p-3 text-center">
              <p className="text-sm font-semibold text-primary">
                Deposit Due Today: {formatCurrency(deposit)}
              </p>
              <p className="mt-0.5 text-xs text-muted">
                Remaining {formatCurrency(total - deposit)} due day of charter
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ===========================================================================
// Success State
// ===========================================================================

function SuccessState({
  yacht,
  data,
}: {
  yacht: Yacht;
  data: BookingFormData;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-2xl py-20 text-center"
    >
      <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary bg-primary/10">
        <Check className="h-10 w-10 text-primary" />
      </div>
      <h2 className="font-heading text-4xl font-bold text-foreground">
        Booking Confirmed
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Thank you, {data.firstName}! Your reservation for the{" "}
        <span className="text-primary-light">{yacht.name}</span> has been received. A
        confirmation email has been sent to{" "}
        <span className="text-foreground">{data.email}</span>.
      </p>
      <div className="mx-auto mt-8 max-w-sm rounded-lg border border-border bg-navy-light/50 p-6 text-left">
        <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest text-primary">
          Next Steps
        </h3>
        <ol className="space-y-3 text-sm text-muted">
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              1
            </span>
            Check your email for the confirmation and receipt.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              2
            </span>
            Complete the{" "}
            <a href="/waiver" className="text-primary underline underline-offset-2">
              digital waiver
            </a>{" "}
            for all guests before your charter date.
          </li>
          <li className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
              3
            </span>
            Arrive at {yacht.location.marina} 15 minutes before departure.
          </li>
        </ol>
      </div>
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Button asChild size="lg">
          <a href="/">Return Home</a>
        </Button>
        <Button asChild variant="outline" size="lg">
          <a href="/waiver">Complete Waiver</a>
        </Button>
      </div>
    </motion.div>
  );
}

// ===========================================================================
// Shared helpers
// ===========================================================================

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: React.ElementType;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, icon: Icon, error, className, ...props }, ref) => {
    return (
      <div>
        <label className="mb-2 block text-sm font-medium tracking-wide text-foreground/80">
          <Icon className="mb-0.5 mr-2 inline-block h-4 w-4 text-primary" />
          {label}
        </label>
        <input
          ref={ref}
          {...props}
          className={cn(
            "w-full rounded-md border bg-navy-light px-4 py-3 text-sm text-foreground placeholder:text-white/30 outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary/40",
            error ? "border-red-500" : "border-border",
            className
          )}
        />
        {error && <p className="mt-1.5 text-sm text-red-400">{error}</p>}
      </div>
    );
  }
);
InputField.displayName = "InputField";

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-muted">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-foreground">{value}</p>
    </div>
  );
}

function PriceRow({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted">{label}</span>
      <span className="text-foreground">{formatCurrency(amount)}</span>
    </div>
  );
}
