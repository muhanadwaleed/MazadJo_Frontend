"use client";

import { motion, useReducedMotion } from "framer-motion";

import {
  fadeInDown,
  fadeInUp,
  motionDuration,
  motionEase,
  scaleIn,
} from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

const VARIANTS = {
  fadeInUp,
  fadeInDown,
  scaleIn,
} as const;

export type ScrollRevealVariant = keyof typeof VARIANTS;

type ScrollRevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: "section" | "div";
  variant?: ScrollRevealVariant;
  id?: string;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  as = "div",
  variant = "fadeInUp",
  id,
}: ScrollRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const motionVariant = VARIANTS[variant];
  const Component = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return (
      <Tag id={id} className={className}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      id={id}
      initial={motionVariant.initial}
      whileInView={motionVariant.animate}
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
