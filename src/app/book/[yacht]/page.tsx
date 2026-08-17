import { notFound } from "next/navigation";
import { getYachtBySlug, yachts } from "@/lib/data/yachts";
import { BookingFlow } from "@/components/booking/booking-flow";
import type { Metadata } from "next";

interface BookingPageProps {
  params: Promise<{ yacht: string }>;
}

export async function generateStaticParams() {
  return yachts.map((yacht) => ({ yacht: yacht.slug }));
}

export async function generateMetadata({
  params,
}: BookingPageProps): Promise<Metadata> {
  const { yacht: slug } = await params;
  const yacht = getYachtBySlug(slug);

  if (!yacht) {
    return { title: "Yacht Not Found | Hurry Up Slowly Yachts" };
  }

  return {
    title: `Book ${yacht.name} | Hurry Up Slowly Yachts`,
    description: `Reserve the ${yacht.name} for your luxury charter experience in Miami. Capacity: ${yacht.capacity} guests.`,
  };
}

const STEPS = [
  { number: 1, label: "Date & Time" },
  { number: 2, label: "Guest Details" },
  { number: 3, label: "Customize" },
  { number: 4, label: "Review & Pay" },
] as const;

export default async function BookingPage({ params }: BookingPageProps) {
  const { yacht: slug } = await params;
  const yacht = getYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      {/* Progress Indicator */}
      <div className="border-b border-border bg-navy/20">
        <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
          <ProgressIndicator steps={STEPS} />
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <BookingFlow yacht={yacht} />
      </div>
    </main>
  );
}

function ProgressIndicator({
  steps,
}: {
  steps: readonly { number: number; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between" aria-label="Booking progress">
      {steps.map((step, index) => (
        <div key={step.number} className="flex flex-1 items-center">
          <div className="flex flex-col items-center gap-2">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary/30 text-sm font-medium text-primary/50 transition-all duration-300"
              data-step={step.number}
            >
              {step.number}
            </div>
            <span className="hidden text-xs tracking-wide text-muted sm:block">
              {step.label}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className="mx-3 h-px flex-1 bg-border sm:mx-4" />
          )}
        </div>
      ))}
    </div>
  );
}
