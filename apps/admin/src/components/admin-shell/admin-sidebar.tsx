"use client";

import { ChevronLeft, ChevronRight, LogOut, Menu } from "lucide-react";
import { useTranslations } from "next-intl";

import { BrandMark, Button, Container } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";
import { Link, usePathname } from "@/i18n/navigation";
import { staffNavIcons, type StaffNavIconKey } from "@/config/nav-icons";
import { routes } from "@/config/routes";
import { StaffLocaleSwitcher } from "@/components/staff-locale-switcher";
import { StaffProfileMenu } from "@/components/staff-profile-menu";
import {
  StaffGlobalSearch,
  type StaffSearchItem,
} from "@/components/admin-shell/staff-global-search";

export type AdminNavItem = {
  label: string;
  href: string;
  icon: StaffNavIconKey;
  keywords?: string;
};

type AdminSidebarProps = {
  items: AdminNavItem[];
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onSignOut?: () => void;
  mobile?: boolean;
  onNavigate?: () => void;
};

export function AdminSidebar({
  items,
  collapsed,
  onToggleCollapsed,
  onSignOut,
  mobile = false,
  onNavigate,
}: AdminSidebarProps) {
  const t = useTranslations("staff");
  const pathname = usePathname();
  const showLabels = !collapsed || mobile;

  return (
    <aside
      className={cn(
        "mazad-staff-sidebar flex h-full shrink-0 flex-col transition-[width] duration-300 ease-out",
        mobile ? "w-full border-0 shadow-none" : collapsed ? "w-[4.5rem]" : "w-64"
      )}
    >
      <div
        className={cn(
          "mazad-staff-sidebar-brand flex items-center border-b border-white/10 px-3 py-3",
          collapsed && !mobile ? "flex-col gap-2 px-2 py-3" : "justify-between gap-2"
        )}
      >
        <Link
          href={routes.home}
          onClick={onNavigate}
          className={cn(
            "cursor-pointer transition-opacity duration-200 hover:opacity-90",
            collapsed && !mobile && "flex justify-center"
          )}
          title={t("console")}
        >
          <BrandMark
            variant="light"
            label={t("console")}
            compact={collapsed && !mobile}
          />
        </Link>

        {!mobile ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={onToggleCollapsed}
            className="shrink-0 cursor-pointer text-white/80 hover:bg-white/10 hover:text-white"
            aria-label={collapsed ? t("expandSidebar") : t("collapseSidebar")}
          >
            {collapsed ? (
              <ChevronRight className="size-4 rtl:rotate-180" />
            ) : (
              <ChevronLeft className="size-4 rtl:rotate-180" />
            )}
          </Button>
        ) : null}
      </div>

      {showLabels ? (
        <div className="flex items-center justify-between border-b border-separator bg-surface px-4 py-2">
          <p className="text-xs text-muted-foreground">{t("subtitle")}</p>
          <span className="rounded-full bg-mazad-accent/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
            Staff
          </span>
        </div>
      ) : null}

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {items.map((item) => {
          const Icon = staffNavIcons[item.icon];
          const isActive =
            pathname === item.href ||
            (item.href !== routes.home && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              data-active={isActive}
              data-collapsed={collapsed && !mobile}
              title={collapsed && !mobile ? item.label : undefined}
              className="mazad-staff-nav-link cursor-pointer"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                  isActive
                    ? "bg-mazad-primary text-white shadow-sm"
                    : "bg-surface text-mazad-primary"
                )}
              >
                <Icon className="size-4" aria-hidden />
              </span>
              {showLabels ? <span className="truncate">{item.label}</span> : null}
            </Link>
          );
        })}
      </nav>

      {onSignOut ? (
        <div className="border-t border-separator p-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onSignOut}
            className={cn(
              "w-full cursor-pointer text-muted-foreground hover:text-mazad-error",
              collapsed && !mobile ? "justify-center px-0" : "justify-start"
            )}
          >
            <LogOut className="size-4" />
            {showLabels ? <span>{t("signOut")}</span> : null}
          </Button>
        </div>
      ) : null}
    </aside>
  );
}

type AdminTopBarProps = {
  searchItems: StaffSearchItem[];
  onOpenMobileNav: () => void;
};

export function AdminTopBar({ searchItems, onOpenMobileNav }: AdminTopBarProps) {
  const t = useTranslations("staff");

  return (
    <header className="mazad-staff-topbar sticky top-0 z-40">
      <Container className="flex h-14 items-center justify-between gap-4 lg:h-[4.25rem]">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            className="shrink-0 cursor-pointer lg:hidden"
            onClick={onOpenMobileNav}
            aria-label={t("openNavigation")}
          >
            <Menu className="size-4" />
          </Button>
          <StaffGlobalSearch
            items={searchItems}
            className="min-w-0 flex-1 sm:max-w-md"
          />
        </div>

        <div className="relative z-10 flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <StaffLocaleSwitcher />
          <StaffProfileMenu />
        </div>
      </Container>
    </header>
  );
}
