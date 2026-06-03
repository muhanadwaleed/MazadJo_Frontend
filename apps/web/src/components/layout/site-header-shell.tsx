"use client";

import { useEffect, useState } from "react";

import { cn } from "@mazad/ui/utils";

export function SiteHeaderShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "mazad-glass-nav sticky top-0 z-50 transition-[padding,background,box-shadow] duration-200",
        scrolled && "mazad-glass-nav-scrolled",
        className
      )}
    >
      {children}
    </header>
  );
}
