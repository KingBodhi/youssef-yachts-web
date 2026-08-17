import Link from "next/link";
import Image from "next/image";
import { Phone, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

const FOOTER_LINKS = {
  charter: [
    { label: "Fleet", href: "/fleet" },
    { label: "Book a Charter", href: "/contact" },
    { label: "Charter FAQ", href: "/faq" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Waiver", href: "/waiver" },
  ],
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#08080A] border-t border-white/10">
      {/* Accent Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-block" aria-label={BRAND.name}>
              <Image
                src="/brand/hus-wordmark.png"
                alt={BRAND.name}
                width={200}
                height={106}
                className="h-20 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              {BRAND.tagline}
            </p>
            <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/40">
              {BRAND.description}
            </p>
          </div>

          {/* Charter Links */}
          <div className="lg:col-span-2 lg:col-start-7">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              Charter
            </h3>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.charter.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              Company
            </h3>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/40 transition-colors duration-300 hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              Get in Touch
            </h3>
            <div className="mt-6 space-y-4">
              <a
                href={`tel:${BRAND.phoneHref}`}
                className="flex items-center gap-3 text-sm text-white/50 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                {BRAND.phone}
              </a>
              <div className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-white/40" />
                {BRAND.location}
              </div>
              <p className="text-xs leading-relaxed text-white/35">
                Speak directly with {BRAND.contactName} to check availability and
                plan your charter.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-xs text-white/30">
              &copy; {currentYear} {BRAND.name}. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="text-xs text-white/30 transition-colors duration-300 hover:text-white/60"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-xs text-white/30 transition-colors duration-300 hover:text-white/60"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
