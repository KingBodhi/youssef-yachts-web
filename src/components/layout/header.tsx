"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { BRAND, NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out",
          isScrolled
            ? "bg-[#08080A]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/30"
            : "bg-transparent"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="group relative z-10 flex items-center gap-3"
              aria-label={BRAND.name}
            >
              <Image
                src="/brand/hus-icon.png"
                alt=""
                width={40}
                height={30}
                priority
                className="h-8 w-auto transition-opacity duration-300 group-hover:opacity-80"
              />
              <span className="font-body text-sm font-semibold uppercase tracking-[0.32em] text-white transition-opacity duration-300 group-hover:opacity-80">
                Hurry Up Slowly
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium tracking-wide text-white/70 transition-colors duration-300 hover:text-white after:absolute after:bottom-0 after:left-1/2 after:h-[1px] after:w-0 after:bg-white after:transition-all after:duration-300 after:-translate-x-1/2 hover:after:w-2/3"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Desktop CTA */}
            <div className="hidden items-center gap-4 lg:flex">
              <a
                href={`tel:${BRAND.phone.replace(/\D/g, "")}`}
                className="flex items-center gap-2 text-sm text-white/60 transition-colors duration-300 hover:text-white"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden xl:inline">{BRAND.phone}</span>
              </a>
              <Button asChild size="sm">
                <Link href="/contact">Book Now</Link>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="relative z-10 flex h-10 w-10 items-center justify-center rounded-sm text-white transition-colors duration-300 hover:text-white lg:hidden"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMobileMenuOpen}
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

      {/* Mobile Menu Overlay + Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-sm bg-[#08080A] border-l border-white/10 shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Drawer Header */}
                <div className="flex h-20 items-center justify-between px-6 border-b border-white/5">
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
                    className="flex h-10 w-10 items-center justify-center rounded-sm text-white/70 hover:text-white transition-colors"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Drawer Links */}
                <nav className="flex-1 overflow-y-auto px-6 py-8">
                  <div className="flex flex-col gap-1">
                    {NAV_LINKS.map((link, index) => (
                      <motion.div
                        key={link.href}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                      >
                        <Link
                          href={link.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="block py-3 text-lg font-medium tracking-wide text-white/80 transition-colors duration-300 hover:text-white border-b border-white/5"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </nav>

                {/* Drawer Footer */}
                <div className="border-t border-white/5 px-6 py-6 space-y-4">
                  <a
                    href={`tel:${BRAND.phone.replace(/\D/g, "")}`}
                    className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
                  >
                    <Phone className="h-4 w-4" />
                    {BRAND.phone}
                  </a>
                  <Button asChild className="w-full">
                    <Link
                      href="/contact"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Book Now
                    </Link>
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
