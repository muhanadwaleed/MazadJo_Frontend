"use client";

import { useLocale, useTranslations } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { cn } from "@mazad/ui/utils";

export function StaffLocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("common");

  return (
    <div
      className={cn(
        "flex items-center gap-0.5 rounded-lg border border-mazad-primary/25 bg-secondary/50 p-0.5 text-xs font-medium",
        className
      )}
      role="group"
      aria-label={t("language")}
    >
      {routing.locales.map((loc) => {
        const label = loc === "ar" ? t("arabic") : t("english");
        const itemClass = cn(
          "min-h-9 min-w-[2.75rem] rounded-md px-2.5 py-1.5 transition-colors sm:min-h-0 sm:min-w-0 sm:px-2 sm:py-1",
          loc === locale
            ? "bg-mazad-primary text-primary-foreground"
            : "text-muted-foreground hover:bg-light-blue/10 hover:text-mazad-primary"
        );

        if (loc === locale) {
          return (
            <span key={loc} className={itemClass} aria-current="true">
              {label}
            </span>
          );
        }

        return (
          <Link
            key={loc}
            href={pathname}
            locale={loc}
            prefetch={false}
            scroll={false}
            className={itemClass}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
