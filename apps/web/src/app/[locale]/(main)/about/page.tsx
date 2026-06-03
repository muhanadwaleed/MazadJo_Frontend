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
      <Container className="space-y-10">
        <PageHeader title={t("title")} description={t("description")} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("whoUsTitle")}</h2>
          {whoItems.length === 0 ? (
            <EmptyState title={t("whoUsEmpty")} />
          ) : (
            <ul className="space-y-4">
              {whoItems.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {pickLocalized(locale, item.title_ar, item.title_en)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {pickLocalized(locale, item.body_ar, item.body_en)}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("whyUsTitle")}</h2>
          {whyItems.length === 0 ? (
            <EmptyState title={t("whyUsEmpty")} />
          ) : (
            <ul className="space-y-4">
              {whyItems.map((item) => (
                <li key={item.id}>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        {pickLocalized(locale, item.title_ar, item.title_en)}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {pickLocalized(locale, item.body_ar, item.body_en)}
                      </p>
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>
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
