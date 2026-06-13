"use client";

import { Home, Gavel, Map, User, type LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { useAuth } from "@mazad/auth";
import { cn } from "@mazad/ui/utils";
import { AddAuctionFab } from "@/components/layout/add-auction-fab";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const t = useTranslations("nav");

  type NavItem = {
    id: string;
    label: string;
    href: string;
    icon: LucideIcon;
    isActive: (path: string) => boolean;
  };

  const leftItems: NavItem[] = [
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
      isActive: (path: string) =>
        path.startsWith(routes.auctions) && !path.includes("/dashboard/listings"),
    },
  ];

  const rightItems: NavItem[] = [
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

  function renderNavItem(item: NavItem) {
    const active = item.isActive(pathname);
    const Icon = item.icon;

    return (
      <Link
        key={item.id}
        href={item.href}
        className={cn(
          "flex h-12 w-16 flex-col items-center justify-center gap-1 rounded-xl transition-all duration-200 active:scale-95",
          active
            ? "bg-light-blue/10 text-mazad-primary"
            : "text-navy/60 hover:bg-light-blue/5 hover:text-mazad-primary"
        )}
      >
        <Icon
          className={cn(
            "size-5 transition-transform duration-200",
            active && "scale-110 stroke-[2.25]"
          )}
        />
        <span
          className={cn(
            "text-[10px] font-medium tracking-tight",
            active ? "font-semibold" : "opacity-80"
          )}
        >
          {item.label}
        </span>
      </Link>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-separator/85 bg-card/85 pb-[env(safe-area-inset-bottom,0px)] shadow-[0_-4px_16px_rgba(7,19,40,0.06)] backdrop-blur-xl md:hidden">
      <nav className="relative flex h-16 items-center justify-around px-2">
        {leftItems.map(renderNavItem)}
        <div className="w-16" aria-hidden />
        {rightItems.map(renderNavItem)}
        <AddAuctionFab />
      </nav>
    </div>
  );
}
