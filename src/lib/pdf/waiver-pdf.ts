import "server-only";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { BRAND } from "@/lib/constants";
import {
  WAIVER_TITLE,
  waiverSections,
  WAIVER_AGREEMENT_STATEMENT,
} from "@/lib/waiver-content";

export interface WaiverPdfInput {
  fullName: string;
  dateOfBirth: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation?: string | null;
  typedSignature: string;
  signedAt: Date;
  ipAddress?: string | null;
  booking?: {
    id: string;
    yachtName?: string;
    scheduleDate?: string;
    charterType?: string;
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

let cachedScriptFont: Buffer | null = null;
async function loadScriptFont(): Promise<Buffer> {
  if (!cachedScriptFont) {
    const fontPath = path.join(
      process.cwd(),
      "src/lib/pdf/fonts/DancingScript.ttf"
    );
    cachedScriptFont = await readFile(fontPath);
  }
  return cachedScriptFont;
}

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
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const helvBold = await doc.embedFont(StandardFonts.HelveticaBold);
  const script = await doc.embedFont(await loadScriptFont(), { subset: false });

  let page: PDFPage = doc.addPage([PAGE_W, PAGE_H]);
  let y = PAGE_H;

  const newPage = () => {
    page = doc.addPage([PAGE_W, PAGE_H]);
    y = PAGE_H - MARGIN;
  };
  const ensure = (needed: number) => {
    if (y - needed < MARGIN) newPage();
  };

  // --- Header band ---
  page.drawRectangle({
    x: 0,
    y: PAGE_H - 90,
    width: PAGE_W,
    height: 90,
    color: NAVY,
  });
  page.drawText(BRAND.name, {
    x: MARGIN,
    y: PAGE_H - 48,
    size: 22,
    font: helvBold,
    color: rgb(1, 1, 1),
  });
  page.drawText(WAIVER_TITLE, {
    x: MARGIN,
    y: PAGE_H - 70,
    size: 12,
    font: helv,
    color: rgb(0.8, 0.86, 0.95),
  });
  y = PAGE_H - 90 - 24;

  // --- Booking reference ---
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
    y -= 22;
  }

  // --- Legal sections ---
  for (const section of waiverSections) {
    ensure(28);
    page.drawText(section.title, {
      x: MARGIN,
      y,
      size: 11,
      font: helvBold,
      color: NAVY,
    });
    y -= 15;

    const lines = wrap(section.content, helv, 9.5, CONTENT_W);
    for (const line of lines) {
      ensure(13);
      page.drawText(line, {
        x: MARGIN,
        y,
        size: 9.5,
        font: helv,
        color: BLACK,
      });
      y -= 12.5;
    }
    y -= 10;
  }

  // --- Signer details ---
  ensure(120);
  y -= 6;
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
      x: MARGIN + 150,
      y,
      size: 9.5,
      font: helv,
      color: BLACK,
    });
    y -= 15;
  };

  detail("Full Name", input.fullName);
  detail("Date of Birth", input.dateOfBirth);
  detail("Email", input.email);
  detail("Phone", input.phone);
  detail("Emergency Contact", input.emergencyContactName);
  detail("Emergency Phone", input.emergencyContactPhone);
  if (input.emergencyContactRelation)
    detail("Relationship", input.emergencyContactRelation);

  // --- Agreement statement ---
  y -= 8;
  ensure(60);
  for (const line of wrap(WAIVER_AGREEMENT_STATEMENT, helv, 9, CONTENT_W)) {
    ensure(12);
    page.drawText(line, { x: MARGIN, y, size: 9, font: helv, color: GREY });
    y -= 12;
  }

  // --- Signature ---
  y -= 24;
  ensure(70);
  page.drawText(input.typedSignature, {
    x: MARGIN + 4,
    y,
    size: 26,
    font: script,
    color: NAVY,
  });
  y -= 8;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: MARGIN + 280, y },
    thickness: 0.75,
    color: GREY,
  });
  y -= 12;
  page.drawText("Electronic Signature", {
    x: MARGIN,
    y,
    size: 8,
    font: helv,
    color: GREY,
  });

  const signedStr = input.signedAt.toISOString().replace("T", " ").slice(0, 19);
  page.drawText(`Signed: ${signedStr} UTC`, {
    x: MARGIN + 300,
    y: y + 20,
    size: 8.5,
    font: helv,
    color: GREY,
  });
  if (input.ipAddress) {
    page.drawText(`IP: ${input.ipAddress}`, {
      x: MARGIN + 300,
      y: y + 8,
      size: 8.5,
      font: helv,
      color: GREY,
    });
  }

  return doc.save();
}
