"use client"

/**
 * @motion-surface HeroSection — Framer Motion (web auction/marketing only)
 */
import { motion } from "framer-motion"

import { fadeInUp, motionDuration, motionEase } from "../motion"
import { cn } from "../utils"

type HeroSectionProps = {
  eyebrow?: string
  title: string
  description?: string
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  visual?: React.ReactNode
  className?: string
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  visual,
  className,
}: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDuration.slow, ease: motionEase }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-separator bg-gradient-to-br from-card via-card to-surface px-6 py-12 shadow-lg sm:px-10 sm:py-16 lg:px-14",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--mazad-light-blue)_12%,transparent),transparent_55%)]" />
      <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
        <motion.div {...fadeInUp} className="max-w-xl space-y-5">
          {eyebrow ? (
            <p className="text-sm font-semibold tracking-widest text-mazad-primary uppercase">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl lg:text-[2.5rem] lg:leading-tight">
            {title}
          </h1>
          {description ? (
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          ) : null}
          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-3 pt-2">
              {primaryAction}
              {secondaryAction}
            </div>
          )}
        </motion.div>
        {visual ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: motionDuration.slow, delay: 0.1, ease: motionEase }}
            className="relative hidden lg:block"
          >
            {visual}
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  )
}
