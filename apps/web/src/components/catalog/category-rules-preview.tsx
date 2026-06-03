import type { CategoryFees, ProductCategory, ProductSettings } from "@mazad/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mazad/ui";

type CategoryRulesPreviewProps = {
  category: ProductCategory;
  labels: {
    settingsTitle: string;
    feesTitle: string;
    noSettings: string;
    minImages: string;
    maxImages: string;
    videoAllowed: string;
    minStartPrice: string;
    minBidIncrement: string;
    deliveryDays: string;
    maxVideoDuration: string;
    subscription: string;
    bidderInsurance: string;
    sellerInsurance: string;
    yes: string;
    no: string;
  };
};

function SettingRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatSettingsRows(
  settings: ProductSettings,
  labels: CategoryRulesPreviewProps["labels"]
) {
  return [
    { label: labels.minImages, value: String(settings.min_images_count) },
    { label: labels.maxImages, value: String(settings.max_images_count) },
    {
      label: labels.videoAllowed,
      value: settings.video_allowed ? labels.yes : labels.no,
    },
    ...(settings.video_allowed && settings.max_video_duration_sec
      ? [
          {
            label: labels.maxVideoDuration,
            value: `${settings.max_video_duration_sec}s`,
          },
        ]
      : []),
    { label: labels.minStartPrice, value: settings.min_start_price },
    { label: labels.minBidIncrement, value: settings.min_bid_increment },
    {
      label: labels.deliveryDays,
      value: String(settings.delivery_period_days),
    },
  ];
}

function formatFeesRows(fees: CategoryFees, labels: CategoryRulesPreviewProps["labels"]) {
  return [
    { label: labels.subscription, value: fees.subscription_amount },
    { label: labels.bidderInsurance, value: fees.bidder_insurance_amount },
    { label: labels.sellerInsurance, value: fees.seller_insurance_amount },
  ];
}

export function CategoryRulesPreview({ category, labels }: CategoryRulesPreviewProps) {
  const settings = category.settings;
  const fees = category.fees;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{labels.settingsTitle}</CardTitle>
          <CardDescription>{category.category_type || "—"}</CardDescription>
        </CardHeader>
        <CardContent>
          {!settings ? (
            <p className="text-sm text-muted-foreground">{labels.noSettings}</p>
          ) : (
            formatSettingsRows(settings, labels).map((row) => (
              <SettingRow key={row.label} label={row.label} value={row.value} />
            ))
          )}
        </CardContent>
      </Card>

      {fees ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{labels.feesTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            {formatFeesRows(fees, labels).map((row) => (
              <SettingRow key={row.label} label={row.label} value={row.value} />
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
