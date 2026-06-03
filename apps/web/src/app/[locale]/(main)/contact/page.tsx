import { getLocale, getTranslations } from "next-intl/server";

import { pickLocalized, publicCmsService } from "@mazad/api";
import { Container, PageHeader } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return { title: t("title") };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations("contact");
  const tErrors = await getTranslations("errors");

  try {
    const contact = await publicCmsService.contactActive();

    return (
      <Container className="space-y-8">
        <PageHeader title={t("title")} description={t("description")} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("detailsTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="font-medium">{t("phone")}: </span>
              <a href={`tel:${contact.phone}`} className="text-primary hover:underline">
                {contact.phone}
              </a>
            </p>
            <p>
              <span className="font-medium">{t("email")}: </span>
              <a href={`mailto:${contact.email}`} className="text-primary hover:underline">
                {contact.email}
              </a>
            </p>
            <p>
              <span className="font-medium">{t("address")}: </span>
              {pickLocalized(locale, contact.address_ar, contact.address_en)}
            </p>
            {contact.social_links_json &&
            Object.keys(contact.social_links_json).length > 0 ? (
              <div className="space-y-1 pt-2">
                <p className="font-medium">{t("social")}</p>
                <ul className="space-y-1">
                  {Object.entries(contact.social_links_json).map(([key, url]) => (
                    <li key={key}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {key}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
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
