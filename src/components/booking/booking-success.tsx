"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { motion } from "framer-motion";
import { Check, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

// Shared confirmation screen. Used by the post-payment /book/success page and
// (in request-only mode) by the booking flow itself.
export function BookingSuccess({
  yachtName,
  firstName,
  email,
  signingLink,
  paid,
  paidAmount,
  remainingAmount,
}: {
  yachtName: string;
  firstName: string;
  email: string;
  signingLink?: string;
  paid: boolean;
  paidAmount?: number;
  remainingAmount?: number;
}) {
  const bookerHref = signingLink ? `${signingLink}&type=booker` : "/waiver?type=booker";
  const [copied, setCopied] = useState(false);
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    if (!signingLink) return;
    QRCode.toDataURL(signingLink, { width: 240, margin: 1 })
      .then(setQr)
      .catch(() => setQr(null));
  }, [signingLink]);

  const copyLink = async () => {
    if (!signingLink) return;
    try {
      await navigator.clipboard.writeText(signingLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

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
        {paid ? "Reservation Confirmed" : "Request Received"}
      </h2>
      <p className="mx-auto mt-4 max-w-md text-muted">
        Thank you, {firstName}! Your charter aboard the{" "}
        <span className="text-primary-light">{yachtName}</span>{" "}
        {paid
          ? "is confirmed and your date is locked in."
          : "request has been received. We'll confirm availability shortly."}{" "}
        A confirmation has been sent to{" "}
        <span className="text-foreground">{email}</span>.
      </p>

      {paid && typeof paidAmount === "number" && (
        <div className="mx-auto mt-8 max-w-md rounded-lg border border-primary/30 bg-primary/5 p-5 text-left">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Amount paid</span>
            <span className="font-heading text-lg font-semibold text-primary">
              {formatCurrency(paidAmount)}
            </span>
          </div>
          {typeof remainingAmount === "number" && remainingAmount > 0 && (
            <div className="mt-2 flex items-center justify-between">
              <span className="text-sm text-muted">
                Balance due on the day of your charter
              </span>
              <span className="text-sm font-medium text-foreground">
                {formatCurrency(remainingAmount)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Booker waiver — required before boarding */}
      <div className="mx-auto mt-8 max-w-md rounded-lg border border-amber-400/40 bg-amber-400/5 p-6 text-left">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-amber-300">
          <FileWarning className="h-4 w-4" /> Required Before Boarding
        </h3>
        <p className="mt-2 text-sm text-muted">
          Complete your charter liability waiver and upload your ID. You can also
          finish it later from your booking link, but it{" "}
          <span className="text-foreground">must be submitted before you board</span>.
        </p>
        <Button asChild size="lg" className="mt-4 w-full">
          <a href={bookerHref}>Complete My Waiver &amp; ID</a>
        </Button>
      </div>

      {/* Guest waiver link + QR */}
      {signingLink && (
        <div className="mx-auto mt-6 max-w-md rounded-lg border border-primary/30 bg-primary/5 p-6 text-left">
          <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">
            Guest Waivers
          </h3>
          <p className="mt-2 text-sm text-muted">
            Every guest signs their own waiver at check-in. Share this link or
            have them scan the QR code.
          </p>
          {qr && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={qr}
              alt="Guest waiver QR code"
              className="mx-auto mt-4 h-40 w-40 rounded-md bg-white p-2"
            />
          )}
          <div className="mt-3 flex items-center gap-2 rounded-md border border-border bg-navy-light/60 p-2">
            <input
              readOnly
              value={signingLink}
              className="flex-1 truncate bg-transparent text-xs text-muted outline-none"
            />
            <button
              onClick={copyLink}
              className="shrink-0 rounded bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground transition hover:opacity-90"
            >
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      <div className="mt-10">
        <Button asChild variant="outline" size="lg">
          <a href="/">Return Home</a>
        </Button>
      </div>
    </motion.div>
  );
}
