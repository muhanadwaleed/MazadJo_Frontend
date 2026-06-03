import { Geist, Geist_Mono, Noto_Sans_Arabic } from "next/font/google";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const notoArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

/** CSS class names for `<html>` — Latin + Arabic font variables. */
export const mazadFontVariables = [
  geistSans.variable,
  geistMono.variable,
  notoArabic.variable,
].join(" ");

/** Latin-only apps (e.g. staff console). */
export const mazadLatinFontVariables = [geistSans.variable, geistMono.variable].join(
  " "
);

export const mazadBodyClassName =
  "min-h-full bg-background font-[family-name:var(--font-geist-sans)] text-foreground antialiased";

export const mazadArabicBodyClassName =
  "min-h-full bg-background font-[family-name:var(--font-noto-arabic)] text-foreground antialiased";

/** Primary CTA — MazadJo orange accent. */
export const primaryButtonClassName =
  "bg-mazad-accent text-white shadow-sm hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md active:scale-[0.98]";
