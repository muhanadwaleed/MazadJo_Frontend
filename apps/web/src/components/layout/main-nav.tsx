"use client";

import { useTranslations } from "next-intl";

import { mainNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@mazad/ui/utils";
import { useAuth } from "@mazad/auth";
import { Badge } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { UserProfileMenu } from "@/components/profile/user-profile-menu";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const t = useTranslations();

  const visibleItems = mainNavItems.filter(
    (item) => item.enabled !== false || item.comingSoon
  );

  return (
    <nav className={cn("hidden items-center gap-0.5 md:flex", className)}>
      {visibleItems.map((item) => {
        const isActive =
          pathname === item.href ||
          (item.href !== routes.home && pathname.startsWith(item.href));

        if (item.comingSoon && !item.enabled) {
          return (
            <span
              key={item.href}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground"
            >
              {t(item.labelKey)}
              <Badge variant="outline" className="text-[10px]">
                {t("common.soon")}
              </Badge>
            </span>
          );
        }

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "relative cursor-pointer rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "bg-light-blue/10 text-mazad-primary"
                : "text-navy/75 hover:bg-surface hover:text-mazad-primary"
            )}
          >
            {t(item.labelKey)}
            {isActive ? (
              <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-mazad-accent" />
            ) : null}
          </Link>
        );
      })}

      <div className="ms-2 flex items-center gap-2 border-s border-separator ps-3">
        {isAuthenticated ? (
          <UserProfileMenu />
        ) : (
          <>
            <ButtonLink variant="ghost" size="sm" href={routes.login}>
              {t("nav.signIn")}
            </ButtonLink>
            <ButtonLink size="sm" href={routes.register}>
              {t("nav.register")}
            </ButtonLink>
          </>
        )}
      </div>
    </nav>
  );
}
