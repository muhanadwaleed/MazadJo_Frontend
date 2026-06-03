/**
 * Motion timings — Framer Motion + CSS transitions.
 * Keep in sync with `styles/tokens.css`.
 */
export const motion = {
  duration: {
    fast: "200ms",
    base: "250ms",
    slow: "300ms",
  },
  durationSeconds: {
    fast: 0.2,
    base: 0.25,
    slow: 0.3,
  },
  ease: "cubic-bezier(0.4, 0, 0.2, 1)",
  easeArray: [0.4, 0, 0.2, 1] as const,
} as const;
