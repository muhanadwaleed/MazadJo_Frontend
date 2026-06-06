import { getLocale, getTranslations } from "next-intl/server";
import { BookOpen, Sparkles } from "lucide-react";

import { asList, pickLocalized, publicCmsService } from "@mazad/api";
import { Card, CardContent, CardHeader, CardTitle, ContentSection } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("about");
  return { title: t("title") };
}

export default async function AboutPage() {
  const locale = await getLocale();
  const t = await getTranslations("about");
  const tErrors = await getTranslations("errors");

  try {
    const [whoUsData, whyUsData] = await Promise.all([
      publicCmsService.whoUs(),
      publicCmsService.whyUs(),
    ]);
    const whoItems = asList(whoUsData).sort((a, b) => a.sort_order - b.sort_order);
    const whyItems = asList(whyUsData).sort((a, b) => a.sort_order - b.sort_order);

    return (
      <MarketingPageShell
        eyebrow={<BookOpen className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <ContentSection title={t("whoUsTitle")} icon={<BookOpen className="size-6 stroke-[1.75]" />}>
          {whoItems.length === 0 ? (
            <EmptyState title={t("whoUsEmpty")} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {whoItems.map((item) => (
                <li key={item.id}>
                  <Card className="h-full border-separator/60 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base text-navy">
                        {pickLocalized(locale, item.title_ar, item.title_en)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {pickLocalized(locale, item.body_ar, item.body_en)}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </ContentSection>

        <ContentSection title={t("whyUsTitle")} icon={<Sparkles className="size-6 stroke-[1.75]" />}>
          {whyItems.length === 0 ? (
            <EmptyState title={t("whyUsEmpty")} />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {whyItems.map((item) => (
                <li key={item.id}>
                  <Card className="h-full border-separator/60 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base text-navy">
                        {pickLocalized(locale, item.title_ar, item.title_en)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {pickLocalized(locale, item.body_ar, item.body_en)}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </ContentSection>
      </MarketingPageShell>
    );
  } catch {
    return (
      <MarketingPageShell
        eyebrow={<BookOpen className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <ErrorState title={tErrors("genericTitle")} message={t("loadError")} />
      </MarketingPageShell>
    );
  }
}
