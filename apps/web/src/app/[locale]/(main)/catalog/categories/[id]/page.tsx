import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

import { catalogService, pickLocalized } from "@mazad/api";
import { Badge, Container, PageHeader } from "@mazad/ui";
import { Link } from "@/i18n/navigation";
import { ErrorState } from "@/components/common/error-state";
import { CategoryRulesPreview } from "@/components/catalog/category-rules-preview";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const t = await getTranslations("catalog");
  try {
    const category = await catalogService.category(id);
    const locale = await getLocale();
    const name = pickLocalized(locale, category.name_ar, category.name_en);
    return { title: `${name} — ${t("title")}` };
  } catch {
    return { title: t("categoryDetailTitle") };
  }
}

export default async function CategoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const locale = await getLocale();
  const t = await getTranslations("catalog");
  const tCommon = await getTranslations("common");
  const tErrors = await getTranslations("errors");

  try {
    const category = await catalogService.category(id);

    if (!category.is_active) {
      notFound();
    }

    const name = pickLocalized(locale, category.name_ar, category.name_en);

    return (
      <Container className="space-y-8">
        <div className="space-y-2">
          <Link
            href="/catalog"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← {t("backToCatalog")}
          </Link>
          <PageHeader title={name} description={category.category_type} />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant={category.is_active ? "default" : "secondary"}>
            {category.is_active ? tCommon("active") : tCommon("inactive")}
          </Badge>
          {category.requires_review ? (
            <Badge variant="outline">{t("requiresReview")}</Badge>
          ) : null}
          {category.requires_inspection ? (
            <Badge variant="outline">{t("requiresInspection")}</Badge>
          ) : null}
          {category.requires_transfer_process ? (
            <Badge variant="outline">{t("requiresTransfer")}</Badge>
          ) : null}
        </div>

        <CategoryRulesPreview
          category={category}
          labels={{
            settingsTitle: t("settingsTitle"),
            feesTitle: t("feesTitle"),
            noSettings: t("noSettings"),
            minImages: t("minImages"),
            maxImages: t("maxImages"),
            videoAllowed: t("videoAllowed"),
            minStartPrice: t("minStartPrice"),
            minBidIncrement: t("minBidIncrement"),
            deliveryDays: t("deliveryDays"),
            maxVideoDuration: t("maxVideoDuration"),
            subscription: t("subscription"),
            bidderInsurance: t("bidderInsurance"),
            sellerInsurance: t("sellerInsurance"),
            yes: tCommon("yes"),
            no: tCommon("no"),
          }}
        />
      </Container>
    );
  } catch {
    return (
      <Container>
        <ErrorState title={tErrors("genericTitle")} message={t("categoryLoadError")} />
      </Container>
    );
  }
}
