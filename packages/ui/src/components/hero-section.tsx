"use client"

/**
 * @motion-surface HeroSection — Framer Motion (web auction/marketing only)
 */
import { motion } from "framer-motion"

import { fadeInUp, motionDuration, motionEase } from "../motion"
import { cn } from "../utils"

type HeroSectionProps = {
  eyebrow?: React.ReactNode
  title: string
  description?: string
  primaryAction?: React.ReactNode
  secondaryAction?: React.ReactNode
  search?: React.ReactNode
  visual?: React.ReactNode
  className?: string
}

export function HeroSection({
  eyebrow,
  title,
  description,
  primaryAction,
  secondaryAction,
  search,
  visual,
  className,
}: HeroSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionDuration.slow, ease: motionEase }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-separator bg-gradient-to-br from-card via-card to-surface px-6 py-10 shadow-lg sm:px-10 sm:py-14 lg:px-12",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--mazad-light-blue)_12%,transparent),transparent_55%)]" />
      <div className="pointer-events-none absolute -end-20 -top-20 size-72 rounded-full bg-mazad-accent/5 blur-3xl" />

      <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
        <motion.div {...fadeInUp} className="space-y-6 lg:col-span-7 xl:col-span-8">
          {eyebrow ? (
            <div className="inline-flex items-center gap-2 rounded-full border border-separator bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-wider text-mazad-primary">
              {eyebrow}
            </div>
          ) : null}
          <div className="space-y-4">
            <h1 className="text-3xl font-bold tracking-tight text-navy sm:text-4xl md:text-5xl md:leading-[1.12]">
              {title}
            </h1>
            {description ? (
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {description}
              </p>
            ) : null}
          </div>

          {search ? <div className="max-w-xl pt-1">{search}</div> : null}

          {(primaryAction || secondaryAction) && (
            <div className="flex flex-wrap gap-3">
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
            className="relative hidden lg:col-span-5 lg:block xl:col-span-4"
          >
            {visual}
          </motion.div>
        ) : null}
      </div>
    </motion.section>
  )
}
