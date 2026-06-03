/**
 * MazadJo color palette — keep in sync with `styles/tokens.css`.
 */
export const colors = {
  navy: "#0B1E3C",
  primary: "#1F3C88",
  lightBlue: "#3A6EDC",
  accent: "#FF6A00",
  accentDark: "#E65C00",
  white: "#FFFFFF",
  gray: "#CFCFD2",
  surface: "#F7F9FC",
  separator: "#E7EAF0",
  success: "#16A34A",
  error: "#E5484D",
  woodLight: "#C47A2C",
  woodMedium: "#8B4E1D",
  woodDark: "#5A2E12",
} as const;

/** @deprecated Use `colors` from `@mazad/ui/tokens` */
export const brandColors = colors;

export type BrandColorKey = keyof typeof colors;
