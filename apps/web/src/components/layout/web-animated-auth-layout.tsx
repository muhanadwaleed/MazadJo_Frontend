"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Gavel, ShieldCheck, Zap } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  fadeInUp,
  motionDuration,
  motionEase,
  staggerContainer,
  staggerItem,
  type AuthInfoBlock,
} from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type WebAnimatedAuthLayoutProps = {
  title: string;
  description?: string;
  brand: React.ReactNode;
  headerActions?: React.ReactNode;
  infoBlocks: AuthInfoBlock[];
  infoPanelTitle: string;
  tagline: string;
  reversePanels?: boolean;
  footerLink?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

function FloatingOrb({
  className,
  duration,
  delay = 0,
}: {
  className: string;
  duration: number;
  delay?: number;
}) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={cn("pointer-events-none absolute rounded-full", className)} />;
  }

  return (
    <motion.div
      className={cn("pointer-events-none absolute rounded-full", className)}
      animate={{ y: [0, -18, 0], x: [0, 10, 0], scale: [1, 1.06, 1] }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

export function WebAnimatedAuthLayout({
  title,
  description,
  brand,
  headerActions,
  infoBlocks,
  infoPanelTitle,
  tagline,
  reversePanels = false,
  footerLink,
  children,
  className,
}: WebAnimatedAuthLayoutProps) {
  const t = useTranslations("auth");
  const prefersReducedMotion = useReducedMotion();

  const trustItems = [
    { icon: Zap, label: t("trustLive") },
    { icon: ShieldCheck, label: t("trustReviewed") },
    { icon: Gavel, label: t("trustSecure") },
  ];

  const infoPanel = (
    <aside className="relative hidden overflow-hidden bg-gradient-to-br from-navy via-mazad-primary to-light-blue lg:flex lg:w-[46%] lg:flex-col">
      <FloatingOrb
        className="-start-16 -top-16 size-64 bg-mazad-accent/15 blur-3xl"
        duration={14}
      />
      <FloatingOrb
        className="-end-10 top-1/3 size-48 bg-white/10 blur-2xl"
        duration={11}
        delay={1.5}
      />
      <FloatingOrb
        className="start-1/4 -bottom-20 size-72 bg-light-blue/20 blur-3xl"
        duration={16}
        delay={0.8}
      />
      <div className="pointer-events-none absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_top_right,var(--mazad-light-blue)_18%,transparent_58%)]" />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0, x: reversePanels ? 24 : -24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: motionDuration.slow, ease: motionEase }}
        className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14"
      >
        <div className="space-y-4">
          {brand}
          <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            {infoPanelTitle}
          </p>
        </div>

        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-3 gap-3 py-8"
        >
          {trustItems.map(({ icon: Icon, label }) => (
            <motion.div
              key={label}
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="rounded-xl border border-white/10 bg-white/8 p-3 text-center backdrop-blur-sm"
            >
              <Icon className="mx-auto size-5 text-mazad-accent" aria-hidden />
              <p className="mt-2 text-[11px] font-semibold leading-tight text-white/85">
                {label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={prefersReducedMotion ? undefined : staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-4"
        >
          {infoBlocks.map((block) => (
            <motion.div
              key={block.title}
              variants={prefersReducedMotion ? undefined : staggerItem}
              className="rounded-2xl border border-white/12 bg-white/6 p-5 backdrop-blur-md transition-colors duration-200 hover:bg-white/10"
            >
              <h2 className="text-base font-semibold text-white">{block.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{block.body}</p>
            </motion.div>
          ))}
        </motion.div>

        <p className="text-xs text-white/45">{tagline}</p>
      </motion.div>
    </aside>
  );

  const formPanel = (
    <div className="flex w-full flex-col bg-surface lg:w-[54%]">
      <div className="flex items-center justify-between border-b border-separator bg-card/80 px-4 py-4 backdrop-blur-sm lg:px-8">
        <div className="lg:hidden">{brand}</div>
        <div className="ms-auto">{headerActions}</div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <motion.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: motionDuration.slow, ease: motionEase, delay: 0.08 }}
          className="mx-auto w-full max-w-md space-y-6"
        >
          <motion.div {...(prefersReducedMotion ? {} : fadeInUp)} className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">{title}</h1>
            {description ? (
              <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
            ) : null}
          </motion.div>

          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: motionDuration.slow,
              ease: motionEase,
              delay: prefersReducedMotion ? 0 : 0.15,
            }}
            className="rounded-2xl border border-mazad-border-subtle bg-card p-6 shadow-lg sm:p-8"
          >
            {children}
          </motion.div>

          {footerLink ? (
            <motion.div
              initial={prefersReducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: motionDuration.base }}
              className="text-center"
            >
              {footerLink}
            </motion.div>
          ) : null}
        </motion.div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "mazad-page flex min-h-screen flex-col lg:flex-row",
        reversePanels && "lg:flex-row-reverse",
        className
      )}
    >
      {infoPanel}
      {formPanel}
    </div>
  );
}
