import { getLocale, getTranslations } from "next-intl/server";
import { Mail, MapPin, Phone } from "lucide-react";

import { pickLocalized, publicCmsService } from "@mazad/api";
import { Card, CardContent } from "@mazad/ui";
import { EmptyState } from "@/components/common/empty-state";
import { MarketingSection } from "@/components/common/marketing-section";
import {
  MotionStaggerGrid,
  MotionStaggerItem,
} from "@/components/common/motion-stagger";
import { MarketingPageShell } from "@/components/layout/marketing-page-shell";

export async function generateMetadata() {
  const t = await getTranslations("contact");
  return { title: t("title") };
}

export default async function ContactPage() {
  const locale = await getLocale();
  const t = await getTranslations("contact");

  try {
    const contact = await publicCmsService.contactActive();

    return (
      <MarketingPageShell
        eyebrow={<Mail className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <MarketingSection
          title={t("detailsTitle")}
          badge={<Mail className="size-5 text-mazad-primary" aria-hidden />}
          variant="scaleIn"
        >
          <MotionStaggerGrid as="ul" className="grid gap-4 sm:grid-cols-2">
            <MotionStaggerItem as="li">
              <Card className="h-full border-separator/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <Phone className="mt-0.5 size-5 shrink-0 text-mazad-primary" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{t("phone")}</p>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm text-mazad-primary transition-colors duration-200 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </MotionStaggerItem>
            <MotionStaggerItem as="li">
              <Card className="h-full border-separator/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <Mail className="mt-0.5 size-5 shrink-0 text-mazad-primary" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{t("email")}</p>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-mazad-primary transition-colors duration-200 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </div>
                </CardContent>
              </Card>
            </MotionStaggerItem>
            <MotionStaggerItem as="li" className="sm:col-span-2">
              <Card className="border-separator/60 shadow-sm transition-shadow duration-200 hover:shadow-md">
                <CardContent className="flex items-start gap-3 p-5">
                  <MapPin className="mt-0.5 size-5 shrink-0 text-mazad-primary" />
                  <div>
                    <p className="text-sm font-semibold text-navy">{t("address")}</p>
                    <p className="text-sm text-muted-foreground">
                      {pickLocalized(locale, contact.address_ar, contact.address_en)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </MotionStaggerItem>
          </MotionStaggerGrid>
          {contact.social_links_json && Object.keys(contact.social_links_json).length > 0 ? (
            <ul className="mt-4 flex flex-wrap gap-2">
              {Object.entries(contact.social_links_json).map(([key, url]) => (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border border-separator bg-card px-4 py-2 text-sm font-semibold text-mazad-primary transition-all duration-200 hover:-translate-y-0.5 hover:border-mazad-primary/30 hover:shadow-sm"
                  >
                    {key}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </MarketingSection>
      </MarketingPageShell>
    );
  } catch {
    return (
      <MarketingPageShell
        eyebrow={<Mail className="size-3.5" />}
        title={t("title")}
        description={t("description")}
      >
        <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
      </MarketingPageShell>
    );
  }
}
