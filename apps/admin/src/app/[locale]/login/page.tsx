import { Suspense } from "react";
import { getLocale, getTranslations } from "next-intl/server";

import { loadAuthInfoBlocks } from "@mazad/api/auth-branding";
import { BrandMark, SplitAuthShell } from "@mazad/ui";

import { StaffLoginForm } from "@/components/staff-login-form";

export default async function LoginPage() {
  const locale = await getLocale();
  const t = await getTranslations("login");
  const tStaff = await getTranslations("staff");

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
      className="min-h-0 flex-1"
      title={t("title")}
      description={t("description")}
      infoPanelTitle={t("infoPanelTitle")}
      tagline={t("tagline")}
      reversePanels={locale === "ar"}
      brand={<BrandMark variant="light" label={tStaff("console")} />}
      infoBlocks={infoBlocks}
    >
      <Suspense fallback={<p className="text-sm text-muted-foreground">{t("loading")}</p>}>
        <StaffLoginForm />
      </Suspense>
    </SplitAuthShell>
  );
}
