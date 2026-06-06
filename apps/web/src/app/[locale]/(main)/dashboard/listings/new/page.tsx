import { getTranslations } from "next-intl/server";
import { FilePlus2 } from "lucide-react";

import { ListingWizard } from "@/components/listings/listing-wizard";
import { routes } from "@/config/routes";
import { PageHero } from "@mazad/ui";
import { PageBackLink } from "@/components/layout/page-back-link";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("listingWizard");
  return { title: t("createTitle") };
}

export default async function NewListingPage() {
  const t = await getTranslations("listingWizard");

  return (
    <div className="space-y-8 py-2 md:py-4">
      <PageBackLink href={routes.dashboard}>{t("backToDashboard")}</PageBackLink>
      <PageHero
        eyebrow={<FilePlus2 className="size-3.5" />}
        title={t("createTitle")}
        description={t("createDescription")}
        actions={
          <ButtonLink size="lg" variant="heroOutline" href={routes.dashboard}>
            {t("backToDashboard")}
          </ButtonLink>
        }
      />
      <ListingWizard mode="create" />
    </div>
  );
}
