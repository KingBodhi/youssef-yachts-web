"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Anchor,
  AlertCircle,
  CheckCircle,
  Upload,
  IdCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  SignatureField,
  type SignatureFieldHandle,
} from "@/components/ui/signature-pad";
import { getWaiverDoc } from "@/lib/waiver-content";

const inputClasses =
  "w-full rounded-md border border-border bg-surface px-4 py-3 text-base text-foreground placeholder:text-muted/60 transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary";
const labelClasses = "mb-1.5 block text-sm font-medium text-foreground/80";

function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",");
  const mime = head.match(/:(.*?);/)?.[1] ?? "image/png";
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) arr[i] = bin.charCodeAt(i);
  return new Blob([arr], { type: mime });
}

function WaiverForm() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("booking") ?? undefined;
  const token = searchParams.get("token") ?? undefined;
  const type = searchParams.get("type") === "booker" ? "booker" : "guest";
  const doc = useMemo(() => getWaiverDoc(type), [type]);

  const [fullName, setFullName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [initials, setInitials] = useState<Record<string, string>>({});
  const [isMinor, setIsMinor] = useState(false);
  const [minorName, setMinorName] = useState("");
  const [minorDateOfBirth, setMinorDateOfBirth] = useState("");
  const [guardianName, setGuardianName] = useState("");

  const [signature, setSignature] = useState<string | null>(null);
  const [guardianSignature, setGuardianSignature] = useState<string | null>(
    null
  );
  const [idFile, setIdFile] = useState<File | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const sigRef = useRef<SignatureFieldHandle>(null);

  const isBooker = type === "booker";
  const initialSections = doc.sections.filter((s) => s.requiresInitials);

  function validate(): string | null {
    if (fullName.trim().length < 2) return "Please enter your full legal name.";
    if (!dateOfBirth) return "Please enter your date of birth.";
    if (isBooker) {
      if (address.trim().length < 3) return "Please enter your address.";
      if (!/^\S+@\S+\.\S+$/.test(email)) return "Please enter a valid email.";
      for (const s of initialSections) {
        if (!initials[s.id]?.trim())
          return "Please initial every section of the agreement.";
      }
      if (isMinor && (!minorName || !minorDateOfBirth || !guardianName))
        return "Please complete the minor and parent/guardian details.";
    }
    if (!signature) return "Please draw your signature.";
    if (!idFile) return "Please upload a photo of your government ID.";
    return null;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const payload = isBooker
        ? {
            type,
            fullName,
            dateOfBirth,
            address,
            email,
            initials,
            isMinor,
            minorName: isMinor ? minorName : undefined,
            minorDateOfBirth: isMinor ? minorDateOfBirth : undefined,
            guardianName: isMinor ? guardianName : undefined,
            bookingId,
            token,
          }
        : { type, fullName, dateOfBirth, bookingId, token };

      const fd = new FormData();
      fd.append("payload", JSON.stringify(payload));
      fd.append("signature", dataUrlToBlob(signature!), "signature.png");
      fd.append("idImage", idFile!, idFile!.name || "id.jpg");
      if (isBooker && isMinor && guardianSignature)
        fd.append(
          "guardianSignature",
          dataUrlToBlob(guardianSignature),
          "guardian.png"
        );

      const res = await fetch("/api/waivers", { method: "POST", body: fd });
      if (res.status === 403) {
        setError(
          "This signing link is invalid or has expired. Please request a new link."
        );
        return;
      }
      if (!res.ok) {
        setError("We couldn't submit your waiver. Please try again.");
        return;
      }
      setIsSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Something went wrong. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto max-w-lg rounded-lg border border-border bg-surface p-12 text-center"
        >
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle className="h-10 w-10 text-green-400" />
          </div>
          <h2 className="font-heading text-2xl font-bold text-foreground">
            Waiver Signed Successfully
          </h2>
          <p className="mt-4 text-muted">
            Thank you, {fullName.split(" ")[0]}. Your signed waiver and ID have
            been recorded for {doc.entity}.
            {!isBooker &&
              " Each additional guest must complete their own waiver before boarding."}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild>
              <a href="/">Return Home</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden">
      <section className="relative bg-gradient-to-b from-navy via-background to-background pt-24">
        <div className="mx-auto max-w-3xl px-4 py-12 text-center sm:px-6">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
            <FileText className="h-7 w-7 text-primary" />
          </div>
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-primary-light">
            Required Before Boarding
          </p>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {isBooker ? "Charter" : "Guest"}{" "}
            <span className="text-brand-gradient">Liability Waiver</span>
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            {doc.entity} — please read carefully{isBooker ? ", initial each section," : ""}{" "}
            draw your signature and upload a photo of your ID.
          </p>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          {bookingId && (
            <div className="mb-8 flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3 text-sm text-primary-light">
              <Anchor className="h-4 w-4 shrink-0" />
              Signing for charter <span className="font-semibold">{bookingId}</span>.
            </div>
          )}

          <form onSubmit={onSubmit} noValidate className="space-y-6">
            <p className="text-sm leading-relaxed text-muted">{doc.intro}</p>

            {/* Legal sections */}
            {doc.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border border-border bg-surface p-6"
              >
                {section.heading && (
                  <h2 className="mb-3 font-heading text-base font-semibold text-foreground">
                    {section.heading}
                  </h2>
                )}
                <p className="text-sm leading-relaxed text-muted">
                  {section.body}
                </p>
                {section.requiresInitials && (
                  <div className="mt-4 flex items-center gap-3">
                    <label className="text-sm font-medium text-foreground/80">
                      Initials *
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={initials[section.id] ?? ""}
                      onChange={(e) =>
                        setInitials((p) => ({
                          ...p,
                          [section.id]: e.target.value.toUpperCase(),
                        }))
                      }
                      placeholder="ABC"
                      className="w-24 rounded-md border border-border bg-background px-3 py-2 text-center text-base font-semibold uppercase tracking-widest text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Personal info */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="mb-4 font-heading text-lg font-semibold text-foreground">
                Your Details
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClasses}>Full Legal Name *</label>
                  <input
                    className={inputClasses}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="John Michael Doe"
                  />
                </div>
                <div>
                  <label className={labelClasses}>Date of Birth *</label>
                  <input
                    type="date"
                    className={inputClasses}
                    value={dateOfBirth}
                    onChange={(e) => setDateOfBirth(e.target.value)}
                  />
                </div>
                {isBooker && (
                  <>
                    <div className="sm:col-span-2">
                      <label className={labelClasses}>Address *</label>
                      <input
                        className={inputClasses}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Street, City, State, ZIP"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className={labelClasses}>Email *</label>
                      <input
                        type="email"
                        className={inputClasses}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="john@example.com"
                      />
                    </div>
                  </>
                )}
              </div>

              {isBooker && (
                <div className="mt-4">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      className="h-5 w-5 rounded border-border bg-surface accent-primary"
                      checked={isMinor}
                      onChange={(e) => setIsMinor(e.target.checked)}
                    />
                    <span className="text-sm text-muted">
                      A participant is under 18 (add parent/guardian details)
                    </span>
                  </label>
                  {isMinor && (
                    <div className="mt-4 grid gap-4 rounded-md border border-border bg-background p-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClasses}>Minor Name *</label>
                        <input
                          className={inputClasses}
                          value={minorName}
                          onChange={(e) => setMinorName(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className={labelClasses}>Minor DOB *</label>
                        <input
                          type="date"
                          className={inputClasses}
                          value={minorDateOfBirth}
                          onChange={(e) => setMinorDateOfBirth(e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClasses}>
                          Parent/Guardian Name *
                        </label>
                        <input
                          className={inputClasses}
                          value={guardianName}
                          onChange={(e) => setGuardianName(e.target.value)}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className={labelClasses}>
                          Parent/Guardian Signature *
                        </label>
                        <SignatureField
                          label="Parent/Guardian signature"
                          onChange={setGuardianSignature}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ID upload */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="mb-2 flex items-center gap-2 font-heading text-lg font-semibold text-foreground">
                <IdCard className="h-5 w-5 text-primary" /> Government ID *
              </h2>
              <p className="mb-4 text-sm text-muted">
                Upload a clear photo of a valid government-issued ID. Stored
                securely and visible only to staff.
              </p>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-background px-4 py-6 text-sm text-muted transition-colors hover:border-primary hover:text-foreground">
                <Upload className="h-4 w-4" />
                {idFile ? "Change ID photo" : "Tap to upload / take a photo"}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    setIdFile(f);
                    setIdPreview(f ? URL.createObjectURL(f) : null);
                  }}
                />
              </label>
              {idPreview && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={idPreview}
                  alt="ID preview"
                  className="mt-4 max-h-48 rounded-md border border-border object-contain"
                />
              )}
            </div>

            {/* Signature */}
            <div className="rounded-lg border border-border bg-surface p-6">
              <h2 className="mb-2 font-heading text-lg font-semibold text-foreground">
                Signature *
              </h2>
              <p className="mb-4 text-sm text-muted">
                Sign with your finger (touchscreen) or mouse. This is your
                binding electronic signature.
              </p>
              <SignatureField
                ref={sigRef}
                label="Participant signature"
                onChange={setSignature}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={submitting}
            >
              {submitting ? (
                "Submitting..."
              ) : (
                <span className="flex items-center gap-2">
                  <Anchor className="h-4 w-4" /> Sign &amp; Submit Waiver
                </span>
              )}
            </Button>
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
