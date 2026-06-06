import { getTranslations } from "next-intl/server";
import { FilePenLine } from "lucide-react";

import { ListingWizard } from "@/components/listings/listing-wizard";
import { routes } from "@/config/routes";
import { PageHero } from "@mazad/ui";
import { PageBackLink } from "@/components/layout/page-back-link";
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
    <div className="space-y-8 py-2 md:py-4">
      <PageBackLink href={routes.dashboard}>{t("backToDashboard")}</PageBackLink>
      <PageHero
        eyebrow={<FilePenLine className="size-3.5" />}
        title={t("editTitle")}
        description={t("editDescription")}
        actions={
          <ButtonLink size="lg" variant="heroOutline" href={routes.dashboard}>
            {t("backToDashboard")}
          </ButtonLink>
        }
      />
      <ListingWizard mode="edit" auctionId={Number.isNaN(auctionId) ? undefined : auctionId} />
    </div>
  );
}
