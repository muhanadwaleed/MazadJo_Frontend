import { getLocale, getTranslations } from "next-intl/server";
import { Scale } from "lucide-react";

import { pickLocalized, publicCmsService } from "@mazad/api";
import { Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { MarketingSection } from "@/components/common/marketing-section";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("terms");
  return { title: t("title") };
}

export default async function TermsPage() {
  const locale = await getLocale();
  const t = await getTranslations("terms");

  try {
    const terms = await publicCmsService.termsActive();
    const title = pickLocalized(locale, terms.title_ar, terms.title_en);
    const body = pickLocalized(locale, terms.body_ar, terms.body_en);

    return (
      <MarketingPageShell
        eyebrow={<Scale className="size-3.5" />}
        title={t("title")}
        description={t("version", { version: terms.version })}
      >
        <MarketingSection
          title={title}
          badge={<Scale className="size-5 text-mazad-primary" aria-hidden />}
        >
          <Card className="border-separator/60 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base text-navy">{title}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {t("effective", {
                  date: new Date(terms.effective_at).toLocaleDateString(locale),
                })}
              </p>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none whitespace-pre-wrap leading-relaxed text-muted-foreground">
                {body}
              </div>
            </CardContent>
          </Card>
        </MarketingSection>
      </MarketingPageShell>
    );
  } catch {
    return (
      <MarketingPageShell
        eyebrow={<Scale className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      </MarketingPageShell>
    );
  }
}
