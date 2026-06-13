"use client";

import { useCallback, useMemo, useState, useSyncExternalStore } from "react";
import { useLocale, useTranslations } from "next-intl";

import { Container, Sheet, SheetContent } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";
import { useAuth } from "@mazad/auth";
import { staffNavItems } from "@/config/routes";
import {
  AdminSidebar,
  AdminTopBar,
  type AdminNavItem,
} from "@/components/admin-shell/admin-sidebar";
import type { StaffSearchItem } from "@/components/admin-shell/staff-global-search";

const SIDEBAR_STORAGE_KEY = "mazad-admin-sidebar-collapsed";

let sidebarCollapsedListeners: Array<() => void> = [];

function subscribeSidebarCollapsed(onStoreChange: () => void) {
  sidebarCollapsedListeners.push(onStoreChange);
  const onStorage = (event: StorageEvent) => {
    if (event.key === SIDEBAR_STORAGE_KEY) onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sidebarCollapsedListeners = sidebarCollapsedListeners.filter(
      (listener) => listener !== onStoreChange
    );
    window.removeEventListener("storage", onStorage);
  };
}

function getSidebarCollapsed() {
  return localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
}

function setSidebarCollapsed(next: boolean) {
  localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
  sidebarCollapsedListeners.forEach((listener) => listener());
}

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const locale = useLocale();
  const { logout } = useAuth();
  const mobileSheetSide = locale === "ar" ? "right" : "left";
  const collapsed = useSyncExternalStore(
    subscribeSidebarCollapsed,
    getSidebarCollapsed,
    () => false
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapsed = useCallback(() => {
    setSidebarCollapsed(!getSidebarCollapsed());
  }, []);

  const navItems: AdminNavItem[] = useMemo(
    () =>
      staffNavItems.map((item) => ({
        label: t(item.labelKey),
        href: item.href,
        icon: item.icon,
        keywords: t(item.labelKey),
      })),
    [t]
  );

  const searchItems: StaffSearchItem[] = useMemo(
    () => navItems.map(({ label, href, keywords }) => ({ label, href, keywords })),
    [navItems]
  );

  return (
    <div className="mazad-page flex min-h-screen bg-surface">
      <div
        className="hidden shrink-0 transition-[width] duration-300 ease-out lg:block"
        style={{ width: collapsed ? "4.5rem" : "16rem" }}
      >
        <div className="fixed inset-y-0 start-0 z-30 hidden lg:flex">
          <AdminSidebar
            items={navItems}
            collapsed={collapsed}
            onToggleCollapsed={toggleCollapsed}
            onSignOut={logout}
          />
        </div>
      </div>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side={mobileSheetSide}
          className={cn(
            "gap-0 !w-64 max-w-[min(100vw,16rem)] overflow-hidden p-0",
            mobileSheetSide === "right" ? "rounded-l-2xl" : "rounded-r-2xl"
          )}
          showCloseButton={false}
        >
          <AdminSidebar
            items={navItems}
            collapsed={false}
            onToggleCollapsed={() => undefined}
            onSignOut={() => {
              logout();
              setMobileOpen(false);
            }}
            mobile
            onNavigate={() => setMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopBar
          searchItems={searchItems}
          onOpenMobileNav={() => setMobileOpen(true)}
        />
        <main className="flex-1">
          <Container className="py-6 md:py-8">{children}</Container>
        </main>
      </div>
    </div>
  );
}
