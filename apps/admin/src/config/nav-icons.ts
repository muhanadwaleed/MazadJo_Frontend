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
  | "publishAuctions"
  | "cms"
  | "configuration"
  | "catalog"
  | "users"
  | "auditLog";

export const staffNavIcons: Record<StaffNavIconKey, LucideIcon> = {
  overview: LayoutDashboard,
  reviewAuctions: ClipboardCheck,
  publishAuctions: Rocket,
  cms: FileText,
  configuration: Settings,
  catalog: LayoutGrid,
  users: Users,
  auditLog: ScrollText,
};
