"use client";

import { Home, Gavel, Map, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@mazad/auth";
import { cn } from "@mazad/ui/utils";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const t = useTranslations("nav");

  const navItems = [
    {
      id: "home",
      label: t("home"),
      href: routes.home,
      icon: Home,
      isActive: (path: string) => path === routes.home,
    },
    {
      id: "auctions",
      label: t("auctions"),
      href: routes.auctions,
      icon: Gavel,
      isActive: (path: string) => path.startsWith(routes.auctions),
    },
    {
      id: "catalog",
      label: t("catalog"),
      href: routes.catalog,
      icon: Map,
      isActive: (path: string) => path.startsWith(routes.catalog),
    },
    {
      id: "profile",
      label: t("profile"),
      href: isAuthenticated ? routes.profile : routes.login,
      icon: User,
      isActive: (path: string) =>
        path.startsWith(routes.profile) ||
        path.startsWith(routes.login) ||
        path.startsWith(routes.register),
    },
  ];

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-separator/85 bg-card/85 backdrop-blur-xl md:hidden pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_16px_rgba(7,19,40,0.06)]">
      <nav className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-12 rounded-xl transition-all duration-200",
                active
                  ? "text-mazad-primary"
                  : "text-navy/60 hover:text-mazad-primary hover:bg-light-blue/5"
              )}
            >
              <Icon className={cn("size-5 transition-transform duration-200", active && "scale-110 stroke-[2.25]")} />
              <span className={cn("text-[10px] font-medium tracking-tight", active ? "font-semibold" : "opacity-80")}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
