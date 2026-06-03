"use client";

import { useTranslations } from "next-intl";
import { usePathname } from "@/i18n/navigation";

import { useAuth } from "@mazad/auth";
import { StaffShell } from "@mazad/ui";

import { StaffTopHeader } from "@/components/staff-top-header";
import { routes, staffNavItems } from "@/config/routes";

export function AdminStaffShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const t = useTranslations();

  const navItems = staffNavItems.map((item) => ({
    label: t(item.labelKey),
    href: item.href,
  }));

  return (
    <StaffShell
      brandHref={routes.home}
      brandLabel={t("staff.console")}
      navItems={navItems}
      pathname={pathname}
      onSignOut={logout}
      signOutLabel={t("staff.signOut")}
      header={<StaffTopHeader />}
    >
      {children}
    </StaffShell>
  );
}

export { StaffOverview } from "@mazad/ui";
