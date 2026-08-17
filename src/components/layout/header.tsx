"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Close the drawer whenever the route changes.
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll while the drawer is open, and restore whatever was there.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMobileMenuOpen]);

  // Escape closes the drawer.
  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobileMenuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "border-b border-white/10 bg-[#08080A]/90 shadow-lg shadow-black/30 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between" aria-label="Main">
            <Link
              href="/"
              className="group relative z-10 flex items-center gap-3"
              aria-label={`${BRAND.name}, home`}
            >
              <Image
                src="/brand/hus-icon.png"
                alt=""
                width={40}
                height={30}
                priority
                className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
              <span className="font-body text-xs font-semibold uppercase tracking-[0.32em] text-white transition-opacity duration-300 group-hover:opacity-80 sm:text-sm">
                Hurry Up Slowly
              </span>
            </Link>

            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative px-4 py-2 text-sm font-medium tracking-wide transition-colors duration-300",
                      active ? "text-white" : "text-white/70 hover:text-white"
                    )}
                  >
                    {link.label}
                    {active ? (
                      <motion.span
                        layoutId="nav-underline"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-x-4 bottom-1 h-px bg-white"
                      />
                    ) : (
                      <span className="absolute bottom-1 left-1/2 h-px w-0 -translate-x-1/2 bg-white/70 transition-[width] duration-300 group-hover:w-[calc(100%-2rem)]" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center gap-4 lg:flex">
              <a
                href={`tel:${BRAND.phoneHref}`}
                className="flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{BRAND.phone}</span>
              </a>
              <Button asChild size="sm">
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-300 hover:bg-white/10 lg:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            <motion.div
              id="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 32, stiffness: 320 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l border-white/10 bg-[#08080A] shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-20 items-center justify-between border-b border-white/5 px-6">
                  <span className="flex items-center gap-2.5">
                    <Image
                      src="/brand/hus-icon.png"
                      alt=""
                      width={32}
                      height={24}
                      className="h-7 w-auto"
                    />
                    <span className="font-body text-xs font-semibold uppercase tracking-[0.28em] text-white">
                      Hurry Up Slowly
                    </span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-6 py-8" aria-label="Mobile">
                  <div className="flex flex-col">
                    {NAV_LINKS.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 24 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.08 + index * 0.06 }}
                      >
                        <Link
                          href={link.href}
                          aria-current={isActive(link.href) ? "page" : undefined}
                          className={cn(
                            "block border-b border-white/5 py-4 text-lg font-medium tracking-wide transition-colors duration-300",
                            isActive(link.href)
                              ? "text-white"
                              : "text-white/70 hover:text-white"
                          )}
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                <div className="space-y-4 border-t border-white/5 px-6 py-6">
                  <a
                    href={`tel:${BRAND.phoneHref}`}
                    className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    {BRAND.phone}
                  </a>
                  <Button asChild className="w-full">
                    <Link href="/contact">Book Now</Link>
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
