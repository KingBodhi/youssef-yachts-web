"use client";

import { motion } from "framer-motion";
import { EASE } from "@/lib/motion";

/**
 * Cross-fade between routes. A template remounts on navigation (a layout does
 * not), so this is what gives the site a soft transition instead of a hard cut
 * when moving from, say, /fleet to a yacht page.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
