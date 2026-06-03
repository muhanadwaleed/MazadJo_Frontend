"use client";

import { Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

import { mainNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link, usePathname } from "@/i18n/navigation";
import { useAuth } from "@mazad/auth";
import { cn } from "@mazad/ui/utils";
import { Button } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { Badge } from "@mazad/ui";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@mazad/ui";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuth();
  const t = useTranslations();
  const locale = useLocale();

  function closeMenu() {
    setOpen(false);
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="border-mazad-primary/30 text-mazad-primary md:hidden"
        aria-label={t("common.openMenu")}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side={locale === "ar" ? "left" : "right"}
          className="flex w-[min(100vw-2rem,20rem)] flex-col overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>{t("metadata.siteName")}</SheetTitle>
          </SheetHeader>

          <nav className="mt-2 flex flex-col gap-1">
            {mainNavItems.map((item) => {
              if (item.comingSoon && !item.enabled) {
                return (
                  <div
                    key={item.href}
                    className="flex min-h-11 items-center justify-between rounded-md px-3 py-2 text-sm text-muted-foreground"
                  >
                    {t(item.labelKey)}
                    <Badge variant="secondary">{t("common.soon")}</Badge>
                  </div>
                );
              }
              if (item.enabled === false) return null;

              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium",
                    isActive
                      ? "bg-mazad-primary text-primary-foreground"
                      : "text-navy hover:bg-light-blue/10"
                  )}
                >
                  {t(item.labelKey)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-col gap-2 border-t border-border pt-6">
            {isAuthenticated && user ? (
              <>
                <Link
                  href={routes.profile}
                  onClick={closeMenu}
                  className={cn(
                    "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-sm font-medium",
                    pathname === routes.profile
                      ? "bg-mazad-primary text-primary-foreground"
                      : "bg-secondary text-mazad-primary"
                  )}
                >
                  {t("nav.profileWithUsername", { username: user.username })}
                </Link>
                <Button
                  variant="outline"
                  className="min-h-11 border-mazad-primary/30 text-mazad-primary"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  {t("nav.signOut")}
                </Button>
              </>
            ) : (
              <>
                <ButtonLink
                  variant="outline"
                  href={routes.login}
                  className="min-h-11"
                  onClick={closeMenu}
                >
                  {t("nav.signIn")}
                </ButtonLink>
                <ButtonLink
                  href={routes.register}
                  className="min-h-11 bg-mazad-accent hover:bg-accent-dark"
                  onClick={closeMenu}
                >
                  {t("nav.register")}
                </ButtonLink>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
