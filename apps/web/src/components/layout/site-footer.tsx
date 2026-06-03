import { getTranslations } from "next-intl/server";

import { footerNavItems } from "@/config/navigation";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { Container } from "@mazad/ui";

export async function SiteFooter() {
  const t = await getTranslations();
  const items = footerNavItems.filter((item) => item.enabled !== false);

  return (
    <footer className="mt-auto border-t border-separator bg-card">
      <Container className="flex flex-col gap-8 py-10 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-lg font-bold text-navy">{t("metadata.siteName")}</p>
          <p className="mt-1 text-sm text-muted-foreground">{t("footer.tagline")}</p>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors duration-200 hover:text-mazad-primary"
            >
              {t(item.labelKey)}
            </Link>
          ))}
          <Link
            href={routes.login}
            className="text-muted-foreground transition-colors duration-200 hover:text-mazad-primary"
          >
            {t("nav.signIn")}
          </Link>
        </nav>
      </Container>
    </footer>
  );
}
