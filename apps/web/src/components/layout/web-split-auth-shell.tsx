import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

import { loadAuthInfoBlocks } from "@mazad/api/auth-branding";
import { routes } from "@/config/routes";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { BrandMark, SplitAuthShell } from "@mazad/ui";

export async function WebSplitAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
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
    <SplitAuthShell
      title={title}
      description={description}
      infoPanelTitle={t("splitPanelTitle")}
      tagline={tFooter("tagline")}
      reversePanels={locale === "ar"}
      brand={
        <Link href={routes.home}>
          <BrandMark className="text-primary-foreground" />
        </Link>
      }
      headerActions={<LocaleSwitcher />}
      infoBlocks={infoBlocks}
    >
      {children}
    </SplitAuthShell>
  );
}
