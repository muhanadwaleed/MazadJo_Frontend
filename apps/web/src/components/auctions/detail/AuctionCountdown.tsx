"use client";

/**
 * AuctionCountdown
 * Animated countdown timer with per-digit flip animation.
 * Pass translated `labels` for RTL/AR support.
 */

import { useEffect, useState } from "react";

interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function useCountdown(endTime: Date | string | number): CountdownState {
  const target = new Date(endTime).getTime();

  const calc = (): CountdownState => {
    const diff = Math.max(0, target - Date.now());
    if (diff === 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
    }
    return {
      days: Math.floor(diff / 86_400_000),
      hours: Math.floor((diff / 3_600_000) % 24),
      minutes: Math.floor((diff / 60_000) % 60),
      seconds: Math.floor((diff / 1_000) % 60),
      expired: false,
    };
  };

  const [state, setState] = useState<CountdownState>(calc);

  useEffect(() => {
    const id = setInterval(() => setState(calc()), 1_000);
    return () => clearInterval(id);
  }, [target]); // eslint-disable-line react-hooks/exhaustive-deps

  return state;
}

function DigitCell({ value, label }: { value: number; label: string }) {
  const padded = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center gap-1">
      {/* Keyed on the value so React remounts the cell and re-runs the flip animation. */}
      <div
        key={padded}
        className="mazad-digit-flip flex size-14 items-center justify-center rounded-[10px] font-bold tabular-nums text-white"
        style={{
          background: "var(--mazad-navy, #071328)",
          fontSize: 28,
          lineHeight: 1,
        }}
      >
        {padded}
      </div>
      <span
        className="text-[11px] font-semibold uppercase tracking-wider"
        style={{ color: "var(--mazad-muted-foreground, #8896AA)" }}
      >
        {label}
      </span>
    </div>
  );
}

interface AuctionCountdownProps {
  endTime: Date | string | number;
  /** Labels — pass translated strings for RTL/AR support */
  labels?: {
    days?: string;
    hours?: string;
    minutes?: string;
    seconds?: string;
    expired?: string;
  };
  className?: string;
}

export function AuctionCountdown({
  endTime,
  labels = {},
  className,
}: AuctionCountdownProps) {
  const { days, hours, minutes, seconds, expired } = useCountdown(endTime);

  const L = {
    days: labels.days ?? "Days",
    hours: labels.hours ?? "Hours",
    minutes: labels.minutes ?? "Mins",
    seconds: labels.seconds ?? "Secs",
    expired: labels.expired ?? "Auction ended",
  };

  if (expired) {
    return (
      <p
        className={`text-sm font-semibold ${className ?? ""}`}
        style={{ color: "var(--mazad-error, #E5484D)" }}
      >
        {L.expired}
      </p>
    );
  }

  return (
    <div
      className={`flex items-start justify-center gap-2 sm:gap-2.5 ${className ?? ""}`}
      role="timer"
      aria-live="polite"
    >
      <DigitCell value={days} label={L.days} />
      <span
        className="select-none pt-3 text-3xl font-bold"
        style={{ color: "var(--mazad-navy, #071328)" }}
        aria-hidden
      >
        :
      </span>
      <DigitCell value={hours} label={L.hours} />
      <span
        className="select-none pt-3 text-3xl font-bold"
        style={{ color: "var(--mazad-navy, #071328)" }}
        aria-hidden
      >
        :
      </span>
      <DigitCell value={minutes} label={L.minutes} />
      <span
        className="select-none pt-3 text-3xl font-bold"
        style={{ color: "var(--mazad-navy, #071328)" }}
        aria-hidden
      >
        :
      </span>
      <DigitCell value={seconds} label={L.seconds} />
    </div>
  );
}
