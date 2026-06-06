"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

import { motionDuration, motionEase } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

export function SiteHeaderShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={prefersReducedMotion ? false : { opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDuration.slow, ease: motionEase }}
      className={cn(
        "mazad-glass-nav mazad-floating-nav sticky top-0 z-50 transition-[background,box-shadow] duration-200",
        scrolled && "mazad-glass-nav-scrolled",
        className
      )}
    >
      {children}
    </motion.header>
  );
}
