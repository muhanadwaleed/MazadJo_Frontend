/**
 * MazadJo Design System — single source of truth for programmatic token access.
 * CSS runtime values live in `@mazad/ui/styles/tokens.css`.
 */
export { colors, brandColors, type BrandColorKey } from "./colors";
export { spacing, layout } from "./spacing";
export { radius } from "./radius";
export { shadows } from "./shadows";
export { motion } from "./motion";
export { typography } from "./typography";

import { colors } from "./colors";
import { spacing, layout } from "./spacing";
import { radius } from "./radius";
import { shadows } from "./shadows";
import { motion } from "./motion";
import { typography } from "./typography";

/** Full token map for tooling, CMS, or runtime theming. */
export const tokens = {
  colors,
  spacing,
  layout,
  radius,
  shadows,
  motion,
  typography,
} as const;

export type MazadJoTokens = typeof tokens;
