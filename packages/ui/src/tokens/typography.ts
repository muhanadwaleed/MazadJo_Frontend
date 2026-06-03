/**
 * Typography scale — fonts loaded via `fonts.ts`, sizes via Tailwind utilities.
 */
export const typography = {
  fontFamily: {
    latin: "var(--font-geist-sans), system-ui, sans-serif",
    arabic: "var(--font-noto-arabic), system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  weight: {
    body: "400",
    bodyMedium: "500",
    heading: "600",
    headingBold: "700",
  },
  lineHeight: {
    body: "1.6",
    heading: "1.25",
  },
} as const;
