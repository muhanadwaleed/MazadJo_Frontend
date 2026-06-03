import { AppShell } from "@/components/layout/app-shell";

export default function AuthRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppShell>{children}</AppShell>;
}
