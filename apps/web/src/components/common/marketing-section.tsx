"use client";

import { SectionHeader } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

import {
  ScrollReveal,
  type ScrollRevealVariant,
} from "@/components/common/scroll-reveal";

type MarketingSectionProps = {
  title: string;
  description?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: ScrollRevealVariant;
  id?: string;
};

/** One scroll reveal per marketing section — header + content animate together. */
export function MarketingSection({
  title,
  description,
  badge,
  action,
  children,
  className,
  delay = 0,
  variant = "fadeInUp",
  id,
}: MarketingSectionProps) {
  return (
    <ScrollReveal
      as="section"
      id={id}
      delay={delay}
      variant={variant}
      className={cn("space-y-6", className)}
    >
      <SectionHeader
        title={title}
        description={description}
        badge={badge}
        action={action}
      />
      {children}
    </ScrollReveal>
  );
}
