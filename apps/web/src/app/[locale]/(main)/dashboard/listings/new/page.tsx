import { getTranslations } from "next-intl/server";

import { ListingWizard } from "@/components/listings/listing-wizard";
import { routes } from "@/config/routes";
import { PageHeader } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";

export async function generateMetadata() {
  const t = await getTranslations("listingWizard");
  return { title: t("createTitle") };
}

export default async function NewListingPage() {
  const t = await getTranslations("listingWizard");

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("createTitle")}
        description={t("createDescription")}
        actions={
          <ButtonLink variant="outline" href={routes.dashboard}>
            {t("backToDashboard")}
          </ButtonLink>
        }
      />
      <ListingWizard mode="create" />
    </div>
  );
}
