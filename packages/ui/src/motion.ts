/**
 * Framer Motion presets — sourced from design tokens.
 * Use only in auction/marketing surfaces (see `motion-policy.ts`).
 */
import { motion as motionTokens } from "./tokens/motion";

export const motionDuration = motionTokens.durationSeconds;

export const motionEase = motionTokens.easeArray;

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: motionDuration.fast, ease: motionEase },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: motionDuration.base, ease: motionEase },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: motionDuration.fast, ease: motionEase },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: motionDuration.base, ease: motionEase },
};

export const cardHover = {
  rest: { y: 0 },
  hover: { y: -4, transition: { duration: motionDuration.fast, ease: motionEase } },
};

export const buttonTap = {
  whileTap: { scale: 0.98 },
  transition: { duration: motionDuration.fast },
};

export const staggerContainer = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.05 },
  },
};

export const staggerItem = {
  initial: { opacity: 0, y: 6 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: motionDuration.base, ease: motionEase },
};
