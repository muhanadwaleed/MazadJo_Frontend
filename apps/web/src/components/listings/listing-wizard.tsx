"use client";

import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  asList,
  auctionsService,
  catalogClientService,
  getApiErrorMessage,
  pickLocalized,
  type AuctionDetail,
  type AuctionMedia,
  type AuctionWritePayload,
  type Country,
  type ProductCategory,
  type ProductSettings,
} from "@mazad/api";
import { CategoryRulesPreview } from "@/components/catalog/category-rules-preview";
import { LocationPicker } from "@/components/catalog/location-picker";
import { ListingMediaSection } from "@/components/listings/listing-media-section";
import { ButtonLink } from "@/components/ui/button-link";
import { routes } from "@/config/routes";
import { apiFieldErrors } from "@/lib/api-field-errors";
import {
  datetimeLocalToIso,
  defaultListingSchedule,
  isoToDatetimeLocal,
} from "@/lib/listing-datetime";
import { canEditListing } from "@/lib/seller-listing-actions";
import { imageCountMeetsMinimum } from "@/lib/listing-media-rules";
import { useRouter } from "@/i18n/navigation";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@mazad/ui";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const textareaClassName =
  "flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

type ListingWizardProps = {
  mode: "create" | "edit";
  auctionId?: number;
};

type FormState = {
  product_category: number | null;
  title: string;
  description: string;
  countryId: number | null;
  cityId: number | null;
  areaId: number | null;
  location_link: string;
  start_price: string;
  reserve_price: string;
  min_bid_increment: string;
  starts_at: string;
  ends_at: string;
};

function buildPayload(form: FormState): AuctionWritePayload {
  if (!form.product_category) {
    throw new Error("Category required");
  }
  return {
    product_category: form.product_category,
    title: form.title.trim(),
    description: form.description.trim(),
    area: form.areaId,
    location_link: form.location_link.trim(),
    start_price: form.start_price.trim(),
    reserve_price: form.reserve_price.trim() || undefined,
    min_bid_increment: form.min_bid_increment.trim() || undefined,
    starts_at: datetimeLocalToIso(form.starts_at),
    ends_at: datetimeLocalToIso(form.ends_at),
  };
}

export function ListingWizard({ mode, auctionId }: ListingWizardProps) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("listingWizard");
  const tCatalog = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const tDashboard = useTranslations("dashboard.listings");

  const defaults = defaultListingSchedule();
  const [form, setForm] = useState<FormState>({
    product_category: null,
    title: "",
    description: "",
    countryId: null,
    cityId: null,
    areaId: null,
    location_link: "",
    start_price: "",
    reserve_price: "",
    min_bid_increment: "",
    starts_at: defaults.starts_at,
    ends_at: defaults.ends_at,
  });

  const [countries, setCountries] = useState<Country[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryDetail, setCategoryDetail] = useState<ProductCategory | null>(null);
  const [mediaItems, setMediaItems] = useState<AuctionMedia[]>([]);
  const [auction, setAuction] = useState<AuctionDetail | null>(null);
  const [loading, setLoading] = useState(mode === "edit");
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const settings: ProductSettings | null = categoryDetail?.settings ?? null;

  const canSubmit =
    mode === "edit" &&
    auction &&
    canEditListing(auction.status) &&
    imageCountMeetsMinimum(mediaItems, settings?.min_images_count ?? 1);

  const loadCategory = useCallback(async (categoryId: number) => {
    try {
      const detail = await catalogClientService.category(categoryId);
      setCategoryDetail(detail);
      setForm((prev) => ({
        ...prev,
        min_bid_increment:
          prev.min_bid_increment || detail.settings?.min_bid_increment || "",
      }));
    } catch {
      setCategoryDetail(null);
    }
  }, []);

  const resolveLocationFromArea = useCallback(async (areaId: number) => {
    try {
      const area = await catalogClientService.area(areaId);
      const city = await catalogClientService.city(area.city);
      setForm((prev) => ({
        ...prev,
        countryId: city.country,
        cityId: city.id,
        areaId: area.id,
      }));
    } catch {
      /* location pickers stay empty */
    }
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        const [countriesData, categoriesData] = await Promise.all([
          catalogClientService.countries({ page_size: 100 }),
          catalogClientService.categories({ page_size: 100, is_active: true }),
        ]);
        setCountries(asList(countriesData).filter((c) => c.is_active));
        setCategories(asList(categoriesData).filter((c) => c.is_active && c.settings));
      } catch {
        toast.error(t("loadCatalogFailed"));
      }
    })();
  }, [t]);

  useEffect(() => {
    if (mode !== "edit" || !auctionId) return;

    void (async () => {
      setLoading(true);
      try {
        const data = await auctionsService.getClient(auctionId);
        setAuction(data);
        setMediaItems(data.media_items ?? []);
        setForm({
          product_category: data.product_category,
          title: data.title,
          description: data.description,
          countryId: null,
          cityId: null,
          areaId: data.area,
          location_link: data.location_link ?? "",
          start_price: data.start_price,
          reserve_price: data.reserve_price ?? "",
          min_bid_increment: data.min_bid_increment,
          starts_at: isoToDatetimeLocal(data.starts_at),
          ends_at: isoToDatetimeLocal(data.ends_at),
        });
        await loadCategory(data.product_category);
        if (data.area) {
          await resolveLocationFromArea(data.area);
        }
      } catch {
        toast.error(t("loadFailed"));
        router.push(routes.dashboard);
      } finally {
        setLoading(false);
      }
    })();
  }, [auctionId, loadCategory, mode, resolveLocationFromArea, router, t]);

  useEffect(() => {
    if (form.product_category) {
      void loadCategory(form.product_category);
    } else {
      setCategoryDetail(null);
    }
  }, [form.product_category, loadCategory]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setFieldErrors((prev) => {
      const next = { ...prev };
      delete next[key];
      delete next[String(key)];
      return next;
    });
  }

  async function handleSave() {
    setSaving(true);
    setFieldErrors({});
    try {
      const payload = buildPayload(form);
      if (mode === "create") {
        const created = await auctionsService.createClient(payload);
        toast.success(t("createSuccess"));
        router.push(routes.listingEdit(created.id));
        return;
      }
      if (!auctionId) return;
      const updated = await auctionsService.patchClient(auctionId, payload);
      setAuction(updated);
      toast.success(t("saveSuccess"));
    } catch (error) {
      if (error instanceof ApiError) {
        setFieldErrors(apiFieldErrors(error));
        toast.error(getApiErrorMessage(error));
      } else {
        toast.error(t("saveFailed"));
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmit() {
    if (!auctionId) return;
    setSubmitting(true);
    try {
      const updated = await auctionsService.submitClient(auctionId);
      setAuction(updated);
      toast.success(tDashboard("submitSuccess"));
      router.push(routes.dashboard);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tDashboard("submitFailed")
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (mode === "edit" && auction && !canEditListing(auction.status)) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("readOnlyTitle")}</CardTitle>
          <CardDescription>{t("readOnlyDescription", { status: auction.status })}</CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink href={routes.dashboard}>{t("backToDashboard")}</ButtonLink>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? t("createTitle") : t("editTitle")}</CardTitle>
          <CardDescription>{t("detailsDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="listing-category">{t("category")}</Label>
            <select
              id="listing-category"
              className={selectClassName}
              value={form.product_category ?? ""}
              disabled={mode === "edit"}
              onChange={(e) =>
                updateField("product_category", e.target.value ? Number(e.target.value) : null)
              }
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {pickLocalized(locale, cat.name_ar, cat.name_en)}
                </option>
              ))}
            </select>
            {fieldErrors.product_category ? (
              <p className="text-sm text-destructive">{fieldErrors.product_category}</p>
            ) : null}
          </div>

          {categoryDetail ? (
            <CategoryRulesPreview
              category={categoryDetail}
              labels={{
                settingsTitle: tCatalog("settingsTitle"),
                feesTitle: tCatalog("feesTitle"),
                noSettings: tCatalog("noSettings"),
                minImages: tCatalog("minImages"),
                maxImages: tCatalog("maxImages"),
                videoAllowed: tCatalog("videoAllowed"),
                minStartPrice: tCatalog("minStartPrice"),
                minBidIncrement: tCatalog("minBidIncrement"),
                deliveryDays: tCatalog("deliveryDays"),
                maxVideoDuration: tCatalog("maxVideoDuration"),
                subscription: tCatalog("subscription"),
                bidderInsurance: tCatalog("bidderInsurance"),
                sellerInsurance: tCatalog("sellerInsurance"),
                yes: tCommon("yes"),
                no: tCommon("no"),
              }}
            />
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="listing-title">{t("title")}</Label>
            <Input
              id="listing-title"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
            />
            {fieldErrors.title ? (
              <p className="text-sm text-destructive">{fieldErrors.title}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="listing-description">{t("description")}</Label>
            <textarea
              id="listing-description"
              className={textareaClassName}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
            />
            {fieldErrors.description ? (
              <p className="text-sm text-destructive">{fieldErrors.description}</p>
            ) : null}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-medium">{t("location")}</h3>
            <LocationPicker
              locale={locale}
              countries={countries}
              countryId={form.countryId}
              cityId={form.cityId}
              areaId={form.areaId}
              onCountryChange={(id) => updateField("countryId", id)}
              onCityChange={(id) => updateField("cityId", id)}
              onAreaChange={(id) => updateField("areaId", id)}
              labels={{
                country: tCatalog("country"),
                city: tCatalog("city"),
                area: tCatalog("area"),
                selectCountry: tCatalog("selectCountry"),
                selectCity: tCatalog("selectCity"),
                selectArea: tCatalog("selectArea"),
                loading: tCatalog("loading"),
              }}
            />
            {fieldErrors.area ? (
              <p className="mt-2 text-sm text-destructive">{fieldErrors.area}</p>
            ) : null}
          </div>

          {settings?.location_link_enabled ? (
            <div className="space-y-2">
              <Label htmlFor="listing-location-link">{t("locationLink")}</Label>
              <Input
                id="listing-location-link"
                value={form.location_link}
                onChange={(e) => updateField("location_link", e.target.value)}
                placeholder={t("locationLinkPlaceholder")}
              />
              {fieldErrors.location_link ? (
                <p className="text-sm text-destructive">{fieldErrors.location_link}</p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="listing-start-price">{t("startPrice")}</Label>
              <Input
                id="listing-start-price"
                inputMode="decimal"
                value={form.start_price}
                onChange={(e) => updateField("start_price", e.target.value)}
              />
              {fieldErrors.start_price ? (
                <p className="text-sm text-destructive">{fieldErrors.start_price}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-reserve-price">
                {t("reservePrice")}
                {settings?.reserve_price_required ? " *" : ""}
              </Label>
              <Input
                id="listing-reserve-price"
                inputMode="decimal"
                value={form.reserve_price}
                onChange={(e) => updateField("reserve_price", e.target.value)}
              />
              {fieldErrors.reserve_price ? (
                <p className="text-sm text-destructive">{fieldErrors.reserve_price}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-increment">{t("minIncrement")}</Label>
              <Input
                id="listing-increment"
                inputMode="decimal"
                value={form.min_bid_increment}
                onChange={(e) => updateField("min_bid_increment", e.target.value)}
              />
              {fieldErrors.min_bid_increment ? (
                <p className="text-sm text-destructive">{fieldErrors.min_bid_increment}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="listing-starts">{t("startsAt")}</Label>
              <Input
                id="listing-starts"
                type="datetime-local"
                value={form.starts_at}
                onChange={(e) => updateField("starts_at", e.target.value)}
              />
              {fieldErrors.starts_at ? (
                <p className="text-sm text-destructive">{fieldErrors.starts_at}</p>
              ) : null}
            </div>
            <div className="space-y-2">
              <Label htmlFor="listing-ends">{t("endsAt")}</Label>
              <Input
                id="listing-ends"
                type="datetime-local"
                value={form.ends_at}
                onChange={(e) => updateField("ends_at", e.target.value)}
              />
              {fieldErrors.ends_at ? (
                <p className="text-sm text-destructive">{fieldErrors.ends_at}</p>
              ) : null}
            </div>
          </div>
        </CardContent>
      </Card>

      {mode === "edit" && auctionId ? (
        <Card>
          <CardContent className="pt-6">
            <ListingMediaSection
              auctionId={auctionId}
              mediaItems={mediaItems}
              settings={settings}
              onChange={setMediaItems}
              labels={{
                mediaTitle: t("mediaTitle"),
                mediaHint: t("mediaHint"),
                photosTitle: t("photosTitle"),
                videosTitle: t("videosTitle"),
                attachmentsTitle: t("attachmentsTitle"),
                addPhotos: t("addPhotos"),
                addVideo: t("addVideo"),
                addAttachment: t("addAttachment"),
                uploading: t("uploading"),
                remove: t("removePhoto"),
                maxPhotosReached: t("maxPhotosReached"),
                videoDurationUnknown: t("videoDurationUnknown"),
                uploadSuccess: t("uploadSuccess"),
                blurNextPhoto: t("blurNextPhoto"),
                noVideosYet: t("noVideosYet"),
                videoPreview: t("videoPreview"),
              }}
            />
            {fieldErrors.media_items ? (
              <p className="mt-2 text-sm text-destructive">{fieldErrors.media_items}</p>
            ) : null}
          </CardContent>
        </Card>
      ) : (
        <p className="text-sm text-muted-foreground">{t("photosAfterSave")}</p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="button" disabled={saving || !form.product_category} onClick={() => void handleSave()}>
          {saving
            ? t("saving")
            : mode === "create"
              ? t("saveDraft")
              : t("saveChanges")}
        </Button>
        {mode === "edit" ? (
          <Button
            type="button"
            variant="secondary"
            disabled={!canSubmit || submitting || saving}
            onClick={() => void handleSubmit()}
            title={!canSubmit ? t("submitNeedsPhotos") : undefined}
          >
            {submitting ? tDashboard("submitting") : tDashboard("submit")}
          </Button>
        ) : null}
        <ButtonLink variant="outline" href={routes.dashboard}>
          {t("backToDashboard")}
        </ButtonLink>
      </div>
    </div>
  );
}
