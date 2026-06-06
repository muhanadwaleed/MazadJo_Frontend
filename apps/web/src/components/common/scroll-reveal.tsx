"use client";

import { motion, useReducedMotion } from "framer-motion";

import { fadeInUp, motionDuration, motionEase } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div";
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const Component = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <Component
      initial={fadeInUp.initial}
      whileInView={fadeInUp.animate}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: motionDuration.slow,
        ease: motionEase,
        delay,
      }}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}
