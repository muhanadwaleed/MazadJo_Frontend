"use client";

import { motion, useReducedMotion } from "framer-motion";

import { staggerContainer, staggerItem } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type MotionStaggerGridProps = {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "div";
  /** `inView` reveals on scroll; `mount` animates when the component mounts. */
  trigger?: "inView" | "mount";
  /** Re-run stagger when this value changes (e.g. filter tabs). */
  resetKey?: string;
};

/** Client motion shell — pass server-rendered children (e.g. AuctionCard) as slots. */
export function MotionStaggerGrid({
  children,
  className,
  as = "ul",
  trigger = "inView",
  resetKey,
}: MotionStaggerGridProps) {
  const prefersReducedMotion = useReducedMotion();
  const Tag = as === "ul" ? "ul" : "div";

  if (prefersReducedMotion) {
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "ul" ? motion.ul : motion.div;
  const viewport = { once: true, margin: "-60px" as const };
  const useResetMode = resetKey !== undefined;

  return (
    <MotionTag
      key={useResetMode ? resetKey : undefined}
      variants={staggerContainer}
      initial="initial"
      {...(useResetMode || trigger === "mount"
        ? { animate: "animate" }
        : { whileInView: "animate", viewport })}
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
