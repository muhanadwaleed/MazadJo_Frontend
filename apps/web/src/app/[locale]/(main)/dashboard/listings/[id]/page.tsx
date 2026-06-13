import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";

import { SellerListingPreview } from "@/components/dashboard/seller-listing-preview";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("dashboard.listingPreview");
  return { title: t("pageTitle", { id }) };
}

export default async function SellerListingPreviewPage({ params }: PageProps) {
  const { id } = await params;
  const auctionId = Number.parseInt(id, 10);

  if (Number.isNaN(auctionId)) {
    notFound();
  }

  return <SellerListingPreview auctionId={auctionId} />;
}
