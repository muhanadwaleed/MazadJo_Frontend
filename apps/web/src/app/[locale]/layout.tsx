import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";

import { getRuntimeApiUrl } from "@mazad/config";

import { AppProviders } from "@/components/providers/app-providers";
import { routing, type Locale } from "@/i18n/routing";
import { isRtl } from "@/lib/locale";
import {
  mazadArabicBodyClassName,
  mazadBodyClassName,
  mazadFontVariables,
} from "@mazad/ui/fonts";

import "../globals.css";
import "@/styles/auction-detail.css";

// Render per request so the injected API_URL reflects the live env var
// (read at runtime), not a value frozen at build time.
export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("siteName"),
      template: `%s · ${t("siteName")}`,
    },
    description: t("siteDescription"),
    icons: {
      icon: [
        { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      ],
      apple: "/apple-touch-icon.png",
      shortcut: "/favicon-32.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();
  const rtl = isRtl(locale);

  // Read API_URL live on the server and hand it to the browser at runtime,
  // so changing it on Railway only needs a restart (no rebuild).
  const apiUrl = getRuntimeApiUrl();

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${mazadFontVariables} h-full antialiased`}
      data-mazad-api-url={apiUrl}
    >
      <body className={rtl ? mazadArabicBodyClassName : mazadBodyClassName}>
        <NextIntlClientProvider locale={locale as Locale} messages={messages}>
          <AppProviders>{children}</AppProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
