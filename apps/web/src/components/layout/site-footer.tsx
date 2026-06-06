import { getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

import { footerNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { BrandMark, Container } from "@mazad/ui";

export async function SiteFooter() {
  const t = await getTranslations();
  const items = footerNavItems.filter((item) => item.enabled !== false);

  return (
    <footer className="mt-auto border-t border-separator bg-navy text-white">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark variant="light" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {t("footer.tagline")}
            </p>
            <p className="mt-6 text-xs text-white/50">{t("footer.copyright")}</p>
          </div>

          <div className="md:col-span-7">
            <p className="mb-4 text-xs font-semibold tracking-widest text-white/50 uppercase">
              {t("footer.explore")}
            </p>
            <nav className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="cursor-pointer text-sm text-white/75 transition-colors duration-200 hover:text-mazad-accent"
                >
                  {t(item.labelKey)}
                </Link>
              ))}
              <Link
                href={routes.login}
                className="cursor-pointer text-sm text-white/75 transition-colors duration-200 hover:text-mazad-accent"
              >
                {t("nav.signIn")}
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold text-white">{t("footer.ctaTitle")}</p>
          <Link
            href={routes.register}
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-mazad-accent transition-opacity duration-200 hover:opacity-85"
          >
            {t("footer.ctaLink")}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
      </Container>
    </footer>
  );
}
