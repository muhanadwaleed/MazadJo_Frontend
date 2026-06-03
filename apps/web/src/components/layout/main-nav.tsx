"use client";

import { useTranslations } from "next-intl";

import { mainNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@mazad/ui/utils";
import { useAuth } from "@mazad/auth";
import { Button, Badge } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";

export function MainNav({ className }: { className?: string }) {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations();

  const visibleItems = mainNavItems.filter(
    (item) => item.enabled !== false || item.comingSoon
  );

  return (
    <nav className={cn("hidden items-center gap-1 md:flex", className)}>
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
              "relative rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              isActive
                ? "text-mazad-primary"
                : "text-navy/75 hover:bg-light-blue/10 hover:text-mazad-primary"
            )}
          >
            {t(item.labelKey)}
            {isActive ? (
              <span className="absolute inset-x-3 -bottom-[1.125rem] h-0.5 rounded-full bg-mazad-accent" />
            ) : null}
          </Link>
        );
      })}

      <div className="ms-3 flex items-center gap-2 border-s border-separator ps-4">
        {isAuthenticated && user ? (
          <>
            <Link
              href={routes.profile}
              className={cn(
                "max-w-[140px] truncate rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200",
                pathname === routes.profile
                  ? "bg-mazad-primary text-white"
                  : "bg-surface text-mazad-primary hover:bg-light-blue/12"
              )}
            >
              {user.username}
            </Link>
            <Button variant="outline" size="sm" onClick={logout}>
              {t("nav.signOut")}
            </Button>
          </>
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
