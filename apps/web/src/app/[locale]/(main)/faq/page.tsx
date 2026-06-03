import { getLocale, getTranslations } from "next-intl/server";

import { asList, pickLocalized, publicCmsService } from "@mazad/api";
import { Container, PageHeader } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@mazad/ui";

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
      <Container className="space-y-8">
        <PageHeader title={t("title")} description={t("description")} />
        {items.length === 0 ? (
          <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
        ) : (
          <ul className="space-y-4">
            {items.map((faq) => (
              <li key={faq.id}>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      {pickLocalized(locale, faq.question_ar, faq.question_en)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {pickLocalized(locale, faq.answer_ar, faq.answer_en)}
                    </p>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Container>
    );
  } catch {
    return (
      <Container>
        <ErrorState title={tErrors("genericTitle")} message={t("loadError")} />
      </Container>
    );
  }
}
