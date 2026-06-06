"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";

import { Container, Sheet, SheetContent } from "@mazad/ui";
import { useAuth } from "@mazad/auth";
import { staffNavItems } from "@/config/routes";
import {
  AdminSidebar,
  AdminTopBar,
  type AdminNavItem,
} from "@/components/admin-shell/admin-sidebar";
import type { StaffSearchItem } from "@/components/admin-shell/staff-global-search";

const SIDEBAR_STORAGE_KEY = "mazad-admin-sidebar-collapsed";

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  const t = useTranslations();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (stored === "true") setCollapsed(true);
    setHydrated(true);
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      return next;
    });
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
        style={{ width: hydrated ? (collapsed ? "4.5rem" : "16rem") : "16rem" }}
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
        <SheetContent side="left" className="w-64 p-0" showCloseButton={false}>
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
