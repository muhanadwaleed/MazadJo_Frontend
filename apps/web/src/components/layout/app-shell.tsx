import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col bg-surface">
      <SiteHeader />
      <main className="flex flex-1 flex-col px-0 pb-20 pt-6 md:pb-0 md:pt-8">{children}</main>
      <SiteFooter />
      <MobileBottomNav />
    </div>
  );
}
