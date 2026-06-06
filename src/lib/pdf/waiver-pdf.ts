import "server-only";
import {
  PDFDocument,
  StandardFonts,
  rgb,
  type PDFFont,
  type PDFImage,
  type PDFPage,
} from "pdf-lib";
import { getWaiverDoc, type WaiverDocType } from "@/lib/waiver-content";

export interface WaiverPdfInput {
  type: WaiverDocType;
  fullName: string;
  dateOfBirth: string;
  email?: string | null;
  address?: string | null;
  initials?: Record<string, string> | null;
  isMinor?: boolean;
  minorName?: string | null;
  minorDateOfBirth?: string | null;
  guardianName?: string | null;
  signaturePng: Uint8Array;
  guardianSignaturePng?: Uint8Array | null;
  signedAt: Date;
  ipAddress?: string | null;
  hasId?: boolean;
  booking?: {
    id: string;
    yachtName?: string;
    scheduleDate?: string;
  } | null;
}

const NAVY = rgb(10 / 255, 22 / 255, 40 / 255);
const ACCENT = rgb(0, 109 / 255, 176 / 255);
const GREY = rgb(0.42, 0.45, 0.5);
const BLACK = rgb(0.1, 0.1, 0.12);

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 50;
const CONTENT_W = PAGE_W - MARGIN * 2;

function wrap(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function generateWaiverPdf(
  input: WaiverPdfInput
): Promise<Uint8Array> {
  const doc = getWaiverDoc(input.type);
  const pdf = await PDFDocument.create();
  const helv = await pdf.embedFont(StandardFonts.Helvetica);
  const helvBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let signatureImg: PDFImage | null = null;
  try {
    signatureImg = await pdf.embedPng(input.signaturePng);
  } catch {
    signatureImg = null;
  }
  let guardianImg: PDFImage | null = null;
  if (input.guardianSignaturePng) {
    try {
      guardianImg = await pdf.embedPng(input.guardianSignaturePng);
    } catch {
      guardianImg = null;
    }
  }

  let page: PDFPage = pdf.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H;

  const newPage = () => {
    page = pdf.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed: number) => {
    if (y - needed < MARGIN) newPage();
  };
  const para = (text: string, size = 9.5, font = helv, lh = 12.5) => {
    for (const line of wrap(text, font, size, CONTENT_W)) {
      ensure(lh);
      page.drawText(line, { x: MARGIN, y, size, font, color: BLACK });
      y -= lh;
    }
  };

  // Header band
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 78,
    width: PAGE_W,
    height: 78,
    color: NAVY,
  });
  page.drawText(doc.entity, {
    x: MARGIN,
    y: PAGE_H - 40,
    size: 18,
    font: helvBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(input.type === "booker" ? "Booker Waiver" : "Guest Waiver", {
    x: MARGIN,
    y: PAGE_H - 60,
    size: 10,
    font: helv,
    color: rgb(0.8, 0.86, 0.95),
  });
  if (doc.code) {
    page.drawText(doc.code, {
      x: PAGE_W - MARGIN - helv.widthOfTextAtSize(doc.code, 9),
      y: PAGE_H - 40,
      size: 9,
      font: helv,
      color: rgb(0.8, 0.86, 0.95),
    });
  }
  y = PAGE_H - 78 - 22;

  // Booking reference
  if (input.booking) {
    const b = input.booking;
    const parts = [
      `Charter Ref: ${b.id}`,
      b.yachtName ? `Vessel: ${b.yachtName}` : null,
      b.scheduleDate ? `Date: ${b.scheduleDate}` : null,
    ].filter(Boolean) as string[];
    page.drawText(parts.join("    •    "), {
      x: MARGIN,
      y,
      size: 9,
      font: helvBold,
      color: ACCENT,
    });
    y -= 20;
  }

  // Title + intro
  for (const line of wrap(doc.title, helvBold, 11, CONTENT_W)) {
    ensure(14);
    page.drawText(line, { x: MARGIN, y, size: 11, font: helvBold, color: NAVY });
    y -= 14;
  }
  y -= 4;
  para(doc.intro);
  y -= 8;

  // Sections
  for (const section of doc.sections) {
    if (section.heading) {
      ensure(18);
      page.drawText(section.heading, {
        x: MARGIN,
        y,
        size: 10,
        font: helvBold,
        color: NAVY,
      });
      y -= 14;
    }
    para(section.body);
    if (section.requiresInitials) {
      const val = input.initials?.[section.id] ?? "____";
      ensure(16);
      page.drawText(`Initials: ${val}`, {
        x: MARGIN,
        y,
        size: 9.5,
        font: helvBold,
        color: ACCENT,
      });
      y -= 14;
    }
    y -= 8;
  }

  // Signer details
  ensure(110);
  y -= 4;
  page.drawText("Signer Details", {
    x: MARGIN,
    y,
    size: 12,
    font: helvBold,
    color: NAVY,
  });
  y -= 18;
  const detail = (label: string, value: string) => {
    ensure(15);
    page.drawText(`${label}:`, {
      x: MARGIN,
      y,
      size: 9.5,
      font: helvBold,
      color: BLACK,
    });
    page.drawText(value, {
      x: MARGIN + 140,
      y,
      size: 9.5,
      font: helv,
      color: BLACK,
    });
    y -= 15;
  };
  detail("Full Name", input.fullName);
  detail("Date of Birth", input.dateOfBirth);
  if (input.address) detail("Address", input.address);
  if (input.email) detail("Email", input.email);
  detail("Government ID", input.hasId ? "On file" : "Not provided");

  // Signature image
  y -= 10;
  ensure(80);
  if (signatureImg) {
    const w = 200;
    const h = Math.min(64, (signatureImg.height / signatureImg.width) * w);
    page.drawImage(signatureImg, { x: MARGIN, y: y - h, width: w, height: h });
    y -= h + 4;
  } else {
    y -= 24;
  }
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: MARGIN + 240, y },
    thickness: 0.75,
    color: GREY,
  });
  y -= 12;
  page.drawText("Participant Signature", {
    x: MARGIN,
    y,
    size: 8,
    font: helv,
    color: GREY,
  });
  const signedStr = input.signedAt.toISOString().replace("T", " ").slice(0, 19);
  page.drawText(`Signed: ${signedStr} UTC`, {
    x: MARGIN + 300,
    y: y + 16,
    size: 8.5,
    font: helv,
    color: GREY,
  });
  if (input.ipAddress) {
    page.drawText(`IP: ${input.ipAddress}`, {
      x: MARGIN + 300,
      y: y + 4,
      size: 8.5,
      font: helv,
      color: GREY,
    });
  }

  // Minor / guardian block
  if (input.isMinor) {
    y -= 26;
    ensure(110);
    page.drawText("Minor — Parent/Guardian", {
      x: MARGIN,
      y,
      size: 12,
      font: helvBold,
      color: NAVY,
    });
    y -= 18;
    if (input.minorName) detail("Minor Name", input.minorName);
    if (input.minorDateOfBirth) detail("Minor DOB", input.minorDateOfBirth);
    if (input.guardianName) detail("Parent/Guardian", input.guardianName);
    y -= 8;
    ensure(80);
    if (guardianImg) {
      const w = 200;
      const h = Math.min(64, (guardianImg.height / guardianImg.width) * w);
      page.drawImage(guardianImg, { x: MARGIN, y: y - h, width: w, height: h });
      y -= h + 4;
    } else {
      y -= 24;
    }
    page.drawLine({
      start: { x: MARGIN, y },
      end: { x: MARGIN + 240, y },
      thickness: 0.75,
      color: GREY,
    });
    y -= 12;
    page.drawText("Parent/Guardian Signature", {
      x: MARGIN,
      y,
      size: 8,
      font: helv,
      color: GREY,
    });
  }

  return pdf.save();
}
