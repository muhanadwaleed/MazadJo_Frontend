import {
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Rocket,
  ScrollText,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

export type StaffNavIconKey =
  | "overview"
  | "reviewAuctions"
  | "subscriptionsStaging"
  | "cms"
  | "configuration"
  | "catalog"
  | "users"
  | "auditLog";

export const staffNavIcons: Record<StaffNavIconKey, LucideIcon> = {
  overview: LayoutDashboard,
  reviewAuctions: ClipboardCheck,
  subscriptionsStaging: Rocket,
  cms: FileText,
  configuration: Settings,
  catalog: LayoutGrid,
  users: Users,
  auditLog: ScrollText,
};
