/**
 * 8px spacing system — keep in sync with Tailwind usage across components.
 */
export const spacing = {
  /** 4px — micro gaps */
  0.5: "0.25rem",
  /** 8px — base unit */
  1: "0.5rem",
  /** 12px */
  1.5: "0.75rem",
  /** 16px */
  2: "1rem",
  /** 24px */
  3: "1.5rem",
  /** 32px */
  4: "2rem",
  /** 40px */
  5: "2.5rem",
  /** 48px */
  6: "3rem",
  /** 64px */
  8: "4rem",
  /** 80px */
  10: "5rem",
  /** 96px */
  12: "6rem",
} as const;

export const layout = {
  maxContentWidth: "90rem",
  narrowContentWidth: "48rem",
} as const;
