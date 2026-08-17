import type { Metadata, Viewport } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ScrollProgress } from "@/components/ui/scroll-progress";
import { BackToTop } from "@/components/ui/back-to-top";
import { BRAND } from "@/lib/constants";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hurryupslowly.com";

export const viewport: Viewport = {
  themeColor: "#08080A",
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Hurry Up Slowly Yachts | Miami Yacht Charter",
    template: `%s`,
  },
  description: BRAND.description,
  applicationName: BRAND.name,
  keywords: [
    "yacht charter Miami",
    "luxury yacht rental",
    "Miami yacht party",
    "Biscayne Bay charter",
    "private yacht Miami",
    "yacht with jacuzzi Miami",
    "Miami Beach yacht rental",
    "party yacht Miami",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Hurry Up Slowly Yachts | Miami Yacht Charter",
    description: BRAND.description,
    siteName: BRAND.name,
    url: "/",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hurry Up Slowly Yachts | Miami Yacht Charter",
    description: BRAND.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <head>
        {/*
          Scroll reveals are JavaScript-driven, so with scripting unavailable
          every revealed element would stay at opacity 0. This forces the final
          state instead of hiding the content.
        */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        <ScrollProgress />
        <Header />
        <main id="main" className="min-h-screen">
          {children}
        </main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
