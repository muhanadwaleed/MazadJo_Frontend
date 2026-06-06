"use client";

import { motion, useReducedMotion } from "framer-motion";

import { staggerContainer, staggerItem } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type MotionStaggerGridProps = {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "div";
};

/** Client motion shell — pass server-rendered children (e.g. AuctionCard) as slots. */
export function MotionStaggerGrid({
  children,
  className,
  as = "ul",
}: MotionStaggerGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as === "ul" ? "ul" : "div";

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;

  return (
    <MotionTag
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}

type MotionStaggerItemProps = {
  children: React.ReactNode;
  className?: string;
  as?: "li" | "div";
};

export function MotionStaggerItem({
  children,
  className,
  as = "li",
}: MotionStaggerItemProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as === "li" ? "li" : "div";

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "li" ? motion.li : motion.div;

  return (
    <MotionTag variants={staggerItem} className={cn(className)}>
      {children}
    </MotionTag>
  );
}
