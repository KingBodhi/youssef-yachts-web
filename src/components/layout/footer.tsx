import Link from "next/link";
import Image from "next/image";
import { Phone, Mail, MapPin } from "lucide-react";
import { BRAND } from "@/lib/constants";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.71a8.21 8.21 0 0 0 4.76 1.52V6.79a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const FOOTER_LINKS = {
  charter: [
    { label: "Fleet", href: "/fleet" },
    { label: "Book a Charter", href: "/contact" },
    { label: "Availability", href: "/fleet" },
  ],
  company: [
    { label: "About", href: "/about" },
    { label: "FAQ", href: "/faq" },
    { label: "Contact", href: "/contact" },
    { label: "Waiver", href: "/waiver" },
  ],
  social: [
    { label: "Instagram", href: BRAND.instagram, icon: InstagramIcon },
    { label: "Facebook", href: BRAND.facebook, icon: FacebookIcon },
    { label: "TikTok", href: BRAND.tiktok, icon: TikTokIcon },
    { label: "YouTube", href: BRAND.youtube, icon: YouTubeIcon },
  ],
} as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#08080A] border-t border-white/10">
      {/* Accent Divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-4">
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

            {/* Contact Info */}
            <div className="mt-8 space-y-3">
              <a
                href={`tel:${BRAND.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-3 text-sm text-white/50 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4 shrink-0 text-white/40" />
                {BRAND.phone}
              </a>
              <a
                href={`mailto:${BRAND.email}`}
                className="flex items-center gap-3 text-sm text-white/50 transition-colors duration-300 hover:text-white"
              >
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                {BRAND.email}
              </a>
              <div className="flex items-start gap-3 text-sm text-white/50">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-white/40" />
                {BRAND.address}
              </div>
            </div>
          </div>

          {/* Charter Links */}
          <div className="lg:col-span-2 lg:col-start-6">
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

          {/* Connect / Social */}
          <div className="lg:col-span-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-white/80">
              Connect
            </h3>
            <ul className="mt-6 space-y-3">
              {FOOTER_LINKS.social.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 text-sm text-white/40 transition-colors duration-300 hover:text-white"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>

            {/* Social Icons Row */}
            <div className="mt-8 flex items-center gap-4">
              {FOOTER_LINKS.social.map((link) => {
                const Icon = link.icon;
                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex h-9 w-9 items-center justify-center rounded-sm border border-white/10 text-white/40 transition-all duration-300 hover:border-white/40 hover:text-white hover:bg-white/5"
                    aria-label={`Follow us on ${link.label}`}
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
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
