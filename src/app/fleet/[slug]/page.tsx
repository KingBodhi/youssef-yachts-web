import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { yachts, getYachtBySlug } from "@/lib/data/yachts";
import { BRAND } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { YachtDetailClient } from "./yacht-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return yachts.map((yacht) => ({
    slug: yacht.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const yacht = getYachtBySlug(slug);

  if (!yacht) {
    return { title: "Yacht Not Found | Yousef Yachts" };
  }

  const title = `${yacht.name} | ${BRAND.name}`;
  const description = `Charter the ${yacht.name} — ${yacht.tagline}. ${yacht.length}' luxury yacht for up to ${yacht.capacity} guests. Starting from ${formatCurrency(yacht.pricing.halfDay)} for a half-day charter in Miami.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      siteName: BRAND.name,
      type: "website",
      images: yacht.heroImage ? [{ url: yacht.heroImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function YachtDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const yacht = getYachtBySlug(slug);

  if (!yacht) {
    notFound();
  }

  return <YachtDetailClient yacht={yacht} />;
}
