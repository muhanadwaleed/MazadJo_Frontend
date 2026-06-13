"use client";

import { ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@mazad/auth";

export function FooterRegisterCta() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-white">{t("footer.ctaTitle")}</p>
      <Link
        href={routes.register}
        className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-mazad-accent underline-offset-4 transition-all duration-200 hover:underline hover:opacity-85"
      >
        {t("footer.ctaLink")}
        <ChevronRight className="size-4 rtl:rotate-180" />
      </Link>
    </div>
  );
}
