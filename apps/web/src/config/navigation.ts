import type { LucideIcon } from "lucide-react";
import {
  Gavel,
  LayoutDashboard,
  LayoutGrid,
  Map,
  Bell,
  HelpCircle,
  Info,
  Mail,
  FileText,
} from "lucide-react";

import { routes } from "@/config/routes";

export type NavFeature = "notifications";

export type NavItem = {
  labelKey: string;
  href: string;
  icon: LucideIcon;
  /** When false, item is hidden until the feature ships */
  enabled?: boolean;
  feature?: NavFeature;
  /** Shown in nav when enabled is false (roadmap hint) */
  comingSoon?: boolean;
};

export const mainNavItems: NavItem[] = [
  { labelKey: "nav.auctions", href: routes.auctions, icon: Gavel, enabled: true },
  { labelKey: "nav.catalog", href: routes.catalog, icon: Map, enabled: true },
  {
    labelKey: "nav.dashboard",
    href: routes.dashboard,
    icon: LayoutDashboard,
    enabled: true,
  },
  {
    labelKey: "nav.notifications",
    href: routes.notifications,
    icon: Bell,
    enabled: false,
    feature: "notifications",
    comingSoon: true,
  },
];

export const footerNavItems: NavItem[] = [
  { labelKey: "nav.browse", href: routes.auctions, icon: Gavel, enabled: true },
  {
    labelKey: "nav.categories",
    href: routes.catalog,
    icon: LayoutGrid,
    enabled: true,
  },
  { labelKey: "nav.faq", href: routes.faq, icon: HelpCircle, enabled: true },
  { labelKey: "nav.about", href: routes.about, icon: Info, enabled: true },
  { labelKey: "nav.contact", href: routes.contact, icon: Mail, enabled: true },
  { labelKey: "nav.terms", href: routes.terms, icon: FileText, enabled: true },
];
