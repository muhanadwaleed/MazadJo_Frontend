import { getTranslations } from "next-intl/server";

import { ListingWizard } from "@/components/listings/listing-wizard";
import { routes } from "@/config/routes";
import { PageHeader } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata() {
  const t = await getTranslations("listingWizard");
  return { title: t("editTitle") };
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("listingWizard");
  const auctionId = Number.parseInt(id, 10);

  return (
    <div className="space-y-8">
      <PageHeader
        title={t("editTitle")}
        description={t("editDescription")}
        actions={
          <ButtonLink variant="outline" href={routes.dashboard}>
            {t("backToDashboard")}
          </ButtonLink>
        }
      />
      <ListingWizard mode="edit" auctionId={Number.isNaN(auctionId) ? undefined : auctionId} />
    </div>
  );
}
