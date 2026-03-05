import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
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

export const metadata: Metadata = {
  title: "Yousef Yachts | Miami's Elite Yacht Charter",
  description: BRAND.description,
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
  openGraph: {
    title: "Yousef Yachts | Miami's Elite Yacht Charter",
    description: BRAND.description,
    siteName: BRAND.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yousef Yachts | Miami's Elite Yacht Charter",
    description: BRAND.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
