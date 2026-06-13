import { getLocale, getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";

import { asList, pickLocalized, publicCmsService } from "@mazad/api";
import { Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { MarketingSection } from "@/components/common/marketing-section";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/common/motion-stagger";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("faq");
  return { title: t("title") };
}

export default async function FaqPage() {
  const locale = await getLocale();
  const t = await getTranslations("faq");
  const tErrors = await getTranslations("errors");

  try {
    const data = await publicCmsService.faqs();
    const items = asList(data).sort((a, b) => a.sort_order - b.sort_order);

    return (
      <MarketingPageShell
        eyebrow={<HelpCircle className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <MarketingSection
          title={t("listTitle")}
          badge={<HelpCircle className="size-5 text-mazad-primary" aria-hidden />}
        >
          {items.length === 0 ? (
            <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
          ) : (
            <MotionStaggerGrid as="ul" className="space-y-3">
              {items.map((faq) => (
                <MotionStaggerItem as="li" key={faq.id}>
                  <Card className="border-separator/60 shadow-sm transition-all duration-200 hover:border-mazad-primary/20 hover:shadow-md">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-navy">
                        {pickLocalized(locale, faq.question_ar, faq.question_en)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
                        {pickLocalized(locale, faq.answer_ar, faq.answer_en)}
                      </p>
                    </CardContent>
                  </Card>
                </MotionStaggerItem>
              ))}
            </MotionStaggerGrid>
          )}
        </MarketingSection>
      </MarketingPageShell>
    );
  } catch {
    return (
      <MarketingPageShell
        eyebrow={<HelpCircle className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <ErrorState title={tErrors("genericTitle")} message={t("loadError")} />
      </MarketingPageShell>
    );
  }
}
