"use client";

import { useTranslations } from "next-intl";

import { footerNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@mazad/auth";

const linkClassName =
  "cursor-pointer text-sm text-white/75 underline-offset-4 transition-colors duration-200 hover:text-mazad-accent hover:underline";

export function FooterNavLinks() {
  const t = useTranslations();
  const { isAuthenticated } = useAuth();
  const items = footerNavItems.filter((item) => item.enabled !== false);

  return (
    <nav className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
      {items.map((item) => (
        <Link key={item.href} href={item.href} className={linkClassName}>
          {t(item.labelKey)}
        </Link>
      ))}
      {!isAuthenticated ? (
        <Link href={routes.login} className={linkClassName}>
          {t("nav.signIn")}
        </Link>
      ) : null}
    </nav>
  );
}
