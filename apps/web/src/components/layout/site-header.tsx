import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { BrandMark, Container } from "@mazad/ui";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SiteHeaderShell } from "@/components/layout/site-header-shell";

export function SiteHeader() {
  return (
    <SiteHeaderShell>
      <Container className="flex h-16 items-center justify-between gap-4 lg:h-[4.25rem]">
        <Link
          href={routes.home}
          className="flex items-center gap-2 transition-opacity hover:opacity-90"
        >
          <BrandMark />
        </Link>
        <div className="relative z-10 flex flex-1 items-center justify-end gap-2 sm:gap-3">
          <LocaleSwitcher />
          <MainNav />
          <MobileNav />
        </div>
      </Container>
    </SiteHeaderShell>
  );
}
