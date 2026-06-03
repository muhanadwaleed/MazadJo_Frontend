"use client"

/**
 * @motion-surface CountdownTimer — Framer Motion (web auction only)
 */
import { useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

import { motionDuration, motionEase } from "../motion"
import { cn } from "../utils"

type TimeLeft = {
  days: number
  hours: number
  minutes: number
  seconds: number
  expired: boolean
}

function getTimeLeft(endIso: string): TimeLeft {
  const diff = new Date(endIso).getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true }
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  const seconds = Math.floor((diff / 1000) % 60)
  return { days, hours, minutes, seconds, expired: false }
}

function CountdownUnit({
  label,
  value,
}: {
  label: string
  value: number
}) {
  const padded = String(value).padStart(2, "0")

  return (
    <div className="flex min-w-[3.25rem] flex-col items-center gap-1">
      <div className="relative overflow-hidden rounded-lg bg-surface px-2.5 py-2 tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: motionDuration.fast, ease: motionEase }}
            className="block text-xl font-bold text-navy sm:text-2xl"
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
    </div>
  )
}

export function CountdownTimer({
  endsAt,
  className,
  labels = {
    days: "Days",
    hours: "Hours",
    minutes: "Min",
    seconds: "Sec",
  },
}: {
  endsAt: string
  className?: string
  labels?: { days: string; hours: string; minutes: string; seconds: string }
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(endsAt))

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(endsAt))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [endsAt])

  const units = useMemo(
    () => [
      { label: labels.days, value: timeLeft.days },
      { label: labels.hours, value: timeLeft.hours },
      { label: labels.minutes, value: timeLeft.minutes },
      { label: labels.seconds, value: timeLeft.seconds },
    ],
    [labels, timeLeft]
  )

  if (timeLeft.expired) {
    return (
      <p className={cn("text-sm font-medium text-muted-foreground", className)}>
        —
      </p>
    )
  }

  return (
    <div
      className={cn("flex items-start gap-2 sm:gap-3", className)}
      role="timer"
      aria-live="polite"
    >
      {units.map((unit) => (
        <CountdownUnit key={unit.label} label={unit.label} value={unit.value} />
      ))}
    </div>
  )
}
