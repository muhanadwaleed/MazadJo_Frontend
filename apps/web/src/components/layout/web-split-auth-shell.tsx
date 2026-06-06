import { getLocale, getTranslations } from "next-intl/server";
import { ChevronRight } from "lucide-react";

import { loadAuthInfoBlocks } from "@mazad/api/auth-branding";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { WebAnimatedAuthLayout } from "@/components/layout/web-animated-auth-layout";
import { BrandMark } from "@mazad/ui";

export async function WebSplitAuthShell({
  title,
  description,
  children,
  footerHref,
  footerLabel,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  footerHref?: string;
  footerLabel?: string;
}) {
  const locale = await getLocale();
  const t = await getTranslations("auth");
  const tFooter = await getTranslations("footer");

  const cmsBlocks = await loadAuthInfoBlocks(locale);

  const infoBlocks =
    cmsBlocks.length > 0
      ? cmsBlocks
      : [
          {
            title: t("splitWhoUsTitle"),
            body: t("splitWhoUsFallback"),
          },
          {
            title: t("splitWhyUsTitle"),
            body: t("splitWhyUsFallback"),
          },
        ];

  return (
    <WebAnimatedAuthLayout
      title={title}
      description={description}
      infoPanelTitle={t("splitPanelTitle")}
      tagline={tFooter("tagline")}
      reversePanels={locale === "ar"}
      infoBlocks={infoBlocks}
      brand={
        <Link href={routes.home} className="cursor-pointer transition-opacity duration-200 hover:opacity-85">
          <BrandMark variant="light" />
        </Link>
      }
      headerActions={<LocaleSwitcher />}
      footerLink={
        footerHref && footerLabel ? (
          <Link
            href={footerHref}
            className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
          >
            {footerLabel}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        ) : undefined
      }
    >
      {children}
    </WebAnimatedAuthLayout>
  );
}
