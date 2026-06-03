import { getLocale, getTranslations } from "next-intl/server";

import { pickLocalized, publicCmsService } from "@mazad/api";
import { Container, PageHeader } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";

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
      <Container className="space-y-8">
        <PageHeader
          title={t("title")}
          description={t("version", { version: terms.version })}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {t("effective", {
                date: new Date(terms.effective_at).toLocaleDateString(locale),
              })}
            </p>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-muted-foreground">
              {body}
            </div>
          </CardContent>
        </Card>
      </Container>
    );
  } catch {
    return (
      <Container className="space-y-8">
        <PageHeader title={t("title")} description={t("description")} />
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      </Container>
    );
  }
}
