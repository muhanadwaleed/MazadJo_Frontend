"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  asList,
  catalogStaffService,
  configurationService,
  getApiErrorMessage,
  type Area,
  type City,
  type Country,
  type FeesConfiguration,
  type ProductCategory,
  type ProductSettings,
} from "@mazad/api";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@mazad/ui";

export type CatalogEntityType = "country" | "city" | "area" | "category";

type CatalogRecordDialogProps = {
  open: boolean;
  mode: "view" | "edit";
  entityType: CatalogEntityType;
  entityId: number | null;
  onOpenChange: (open: boolean) => void;
  onSaved: () => void;
};

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";

function ViewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-border py-2 text-sm last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

export function CatalogRecordDialog({
  open,
  mode,
  entityType,
  entityId,
  onOpenChange,
  onSaved,
}: CatalogRecordDialogProps) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [country, setCountry] = useState<Country | null>(null);
  const [city, setCity] = useState<City | null>(null);
  const [area, setArea] = useState<Area | null>(null);
  const [category, setCategory] = useState<ProductCategory | null>(null);
  const [countries, setCountries] = useState<Country[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [fees, setFees] = useState<FeesConfiguration[]>([]);

  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [code, setCode] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [parentCountryId, setParentCountryId] = useState<number | "">("");
  const [parentCityId, setParentCityId] = useState<number | "">("");
  const [categoryType, setCategoryType] = useState("");
  const [requiresReview, setRequiresReview] = useState(true);
  const [requiresTransfer, setRequiresTransfer] = useState(false);
  const [requiresInspection, setRequiresInspection] = useState(false);
  const [feesId, setFeesId] = useState<number | "">("");
  const [settings, setSettings] = useState<Partial<ProductSettings>>({});

  const boolLabel = (value: boolean) =>
    value ? tCommon("status.yes") : tCommon("status.no");

  const entityLabel = t(`entities.${entityType}`);

  const load = useCallback(async () => {
    if (!entityId) return;
    setLoading(true);
    try {
      if (entityType === "country") {
        const data = await catalogStaffService.getCountry(entityId);
        setCountry(data);
        setNameEn(data.name_en);
        setNameAr(data.name_ar);
        setCode(data.code);
        setIsActive(data.is_active);
      } else if (entityType === "city") {
        const [data, countryList] = await Promise.all([
          catalogStaffService.getCity(entityId),
          catalogStaffService.listCountries(),
        ]);
        setCity(data);
        setCountries(asList(countryList));
        setNameEn(data.name_en);
        setNameAr(data.name_ar);
        setIsActive(data.is_active);
        setParentCountryId(data.country);
      } else if (entityType === "area") {
        const [data, cityList] = await Promise.all([
          catalogStaffService.getArea(entityId),
          catalogStaffService.listCities(),
        ]);
        setArea(data);
        setCities(asList(cityList));
        setNameEn(data.name_en);
        setNameAr(data.name_ar);
        setIsActive(data.is_active);
        setParentCityId(data.city);
      } else {
        const [data, feeList] = await Promise.all([
          catalogStaffService.getCategory(entityId),
          configurationService.listFees(),
        ]);
        setCategory(data);
        const feeItems = asList(feeList);
        setFees(feeItems);
        setNameEn(data.name_en);
        setNameAr(data.name_ar);
        setCategoryType(data.category_type);
        setRequiresReview(data.requires_review);
        setRequiresTransfer(data.requires_transfer_process);
        setRequiresInspection(data.requires_inspection);
        setIsActive(data.is_active);
        setSettings(data.settings ?? {});
        if (data.fees && feeItems.length) {
          const match = feeItems.find(
            (f) =>
              f.subscription_amount === data.fees?.subscription_amount &&
              f.bidder_insurance_amount === data.fees?.bidder_insurance_amount
          );
          if (match) setFeesId(match.id);
        }
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadRecordFailed")
      );
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, onOpenChange, t]);

  useEffect(() => {
    if (open && entityId) {
      void load();
    } else if (!open) {
      setCountry(null);
      setCity(null);
      setArea(null);
      setCategory(null);
    }
  }, [open, entityId, load]);

  async function handleSave() {
    if (!entityId) return;
    setSaving(true);
    try {
      if (entityType === "country") {
        await catalogStaffService.updateCountry(entityId, {
          name_en: nameEn.trim(),
          name_ar: nameAr.trim(),
          code: code.trim().toUpperCase(),
          is_active: isActive,
        });
      } else if (entityType === "city") {
        if (!parentCountryId) {
          toast.error(t("toast.countryRequired"));
          return;
        }
        await catalogStaffService.updateCity(entityId, {
          country: parentCountryId,
          name_en: nameEn.trim(),
          name_ar: nameAr.trim(),
          is_active: isActive,
        });
      } else if (entityType === "area") {
        if (!parentCityId) {
          toast.error(t("toast.cityRequired"));
          return;
        }
        await catalogStaffService.updateArea(entityId, {
          city: parentCityId,
          name_en: nameEn.trim(),
          name_ar: nameAr.trim(),
          is_active: isActive,
        });
      } else {
        if (!feesId) {
          toast.error(t("toast.feeGroupRequired"));
          return;
        }
        await catalogStaffService.updateCategory(entityId, {
          name_en: nameEn.trim(),
          name_ar: nameAr.trim(),
          category_type: categoryType.trim(),
          requires_review: requiresReview,
          requires_transfer_process: requiresTransfer,
          requires_inspection: requiresInspection,
          is_active: isActive,
          fees_configuration: feesId,
          settings: {
            min_images_count: Number(settings.min_images_count) || 1,
            max_images_count: Number(settings.max_images_count) || 10,
            video_allowed: settings.video_allowed ?? false,
            max_video_duration_sec: settings.max_video_duration_sec ?? null,
            attachments_allowed: settings.attachments_allowed ?? false,
            location_link_enabled: settings.location_link_enabled ?? false,
            min_start_price: String(settings.min_start_price ?? "1"),
            min_bid_increment: String(settings.min_bid_increment ?? "1"),
            reserve_price_required: settings.reserve_price_required ?? false,
            blur_option_enabled: settings.blur_option_enabled ?? false,
            delivery_period_days: Number(settings.delivery_period_days) || 7,
            is_active: settings.is_active ?? true,
          },
        });
      }
      toast.success(t("toast.saved"));
      onSaved();
      onOpenChange(false);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.saveFailed")
      );
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "view"
      ? t("dialog.viewTitle", { entity: entityLabel })
      : t("dialog.editTitle", { entity: entityLabel });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>
            {entityId ? tCommon("labels.id", { id: entityId }) : ""}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
        ) : mode === "view" ? (
          <div className="space-y-1">
            {entityType === "country" && country ? (
              <>
                <ViewRow label={tCommon("labels.nameEn")} value={country.name_en} />
                <ViewRow label={tCommon("labels.nameAr")} value={country.name_ar} />
                <ViewRow label={tCommon("labels.code")} value={country.code} />
                <ViewRow label={tCommon("labels.active")} value={boolLabel(country.is_active)} />
              </>
            ) : null}
            {entityType === "city" && city ? (
              <>
                <ViewRow label={t("dialog.countryId")} value={city.country} />
                <ViewRow label={tCommon("labels.nameEn")} value={city.name_en} />
                <ViewRow label={tCommon("labels.nameAr")} value={city.name_ar} />
                <ViewRow label={tCommon("labels.active")} value={boolLabel(city.is_active)} />
              </>
            ) : null}
            {entityType === "area" && area ? (
              <>
                <ViewRow label={t("dialog.cityId")} value={area.city} />
                <ViewRow label={tCommon("labels.nameEn")} value={area.name_en} />
                <ViewRow label={tCommon("labels.nameAr")} value={area.name_ar} />
                <ViewRow label={tCommon("labels.active")} value={boolLabel(area.is_active)} />
              </>
            ) : null}
            {entityType === "category" && category ? (
              <>
                <ViewRow label={tCommon("labels.nameEn")} value={category.name_en} />
                <ViewRow label={tCommon("labels.nameAr")} value={category.name_ar} />
                <ViewRow label={t("dialog.type")} value={category.category_type} />
                <ViewRow label={t("dialog.requiresReview")} value={boolLabel(category.requires_review)} />
                <ViewRow label={t("dialog.requiresTransfer")} value={boolLabel(category.requires_transfer_process)} />
                <ViewRow label={t("dialog.requiresInspection")} value={boolLabel(category.requires_inspection)} />
                <ViewRow label={tCommon("labels.active")} value={boolLabel(category.is_active)} />
                {category.settings ? (
                  <>
                    <p className="pt-3 text-sm font-medium">{t("dialog.listingSettings")}</p>
                    <ViewRow label={t("minImages")} value={category.settings.min_images_count} />
                    <ViewRow label={t("maxImages")} value={category.settings.max_images_count} />
                    <ViewRow label={t("dialog.videoAllowed")} value={boolLabel(category.settings.video_allowed)} />
                    <ViewRow
                      label={t("dialog.maxVideoSec")}
                      value={category.settings.max_video_duration_sec ?? tCommon("status.none")}
                    />
                    <ViewRow label={t("minStartPrice")} value={category.settings.min_start_price} />
                    <ViewRow label={t("minBidIncrement")} value={category.settings.min_bid_increment} />
                    <ViewRow label={t("dialog.reserveRequired")} value={boolLabel(category.settings.reserve_price_required)} />
                    <ViewRow label={t("dialog.locationLink")} value={boolLabel(category.settings.location_link_enabled)} />
                    <ViewRow label={t("dialog.blurOption")} value={boolLabel(category.settings.blur_option_enabled)} />
                    <ViewRow label={t("dialog.deliveryDays")} value={category.settings.delivery_period_days} />
                  </>
                ) : null}
                {category.fees ? (
                  <>
                    <p className="pt-3 text-sm font-medium">{t("dialog.fees")}</p>
                    <ViewRow label={t("dialog.subscription")} value={category.fees.subscription_amount} />
                    <ViewRow label={t("dialog.bidderInsurance")} value={category.fees.bidder_insurance_amount} />
                    <ViewRow label={t("dialog.sellerInsurance")} value={category.fees.seller_insurance_amount} />
                  </>
                ) : null}
              </>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="space-y-2">
              <Label>{tCommon("labels.nameEn")}</Label>
              <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={saving} />
            </div>
            <div className="space-y-2">
              <Label>{tCommon("labels.nameAr")}</Label>
              <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={saving} />
            </div>
            {entityType === "country" ? (
              <div className="space-y-2">
                <Label>{tCommon("labels.code")}</Label>
                <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={saving} />
              </div>
            ) : null}
            {entityType === "city" ? (
              <div className="space-y-2">
                <Label>{t("country")}</Label>
                <select
                  className={selectClassName}
                  value={parentCountryId}
                  onChange={(e) => setParentCountryId(Number(e.target.value))}
                  disabled={saving}
                >
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {entityType === "area" ? (
              <div className="space-y-2">
                <Label>{t("city")}</Label>
                <select
                  className={selectClassName}
                  value={parentCityId}
                  onChange={(e) => setParentCityId(Number(e.target.value))}
                  disabled={saving}
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name_en}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            {entityType === "category" ? (
              <>
                <div className="space-y-2">
                  <Label>{t("categoryType")}</Label>
                  <Input
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                    disabled={saving}
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t("feeGroup")}</Label>
                  <select
                    className={selectClassName}
                    value={feesId}
                    onChange={(e) => setFeesId(Number(e.target.value))}
                    disabled={saving}
                  >
                    {fees.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>{t("minImages")}</Label>
                    <Input
                      type="number"
                      value={settings.min_images_count ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          min_images_count: Number(e.target.value),
                        }))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("maxImages")}</Label>
                    <Input
                      type="number"
                      value={settings.max_images_count ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          max_images_count: Number(e.target.value),
                        }))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("minStartPrice")}</Label>
                    <Input
                      value={settings.min_start_price ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, min_start_price: e.target.value }))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("minBidIncrement")}</Label>
                    <Input
                      value={settings.min_bid_increment ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({ ...s, min_bid_increment: e.target.value }))
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("dialog.maxVideoSec")}</Label>
                    <Input
                      type="number"
                      value={settings.max_video_duration_sec ?? ""}
                      onChange={(e) =>
                        setSettings((s) => ({
                          ...s,
                          max_video_duration_sec: e.target.value
                            ? Number(e.target.value)
                            : null,
                        }))
                      }
                      disabled={saving}
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={settings.video_allowed ?? false}
                    onChange={(e) =>
                      setSettings((s) => ({ ...s, video_allowed: e.target.checked }))
                    }
                    disabled={saving}
                  />
                  {t("dialog.videoAllowed")}
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={requiresReview}
                    onChange={(e) => setRequiresReview(e.target.checked)}
                    disabled={saving}
                  />
                  {t("dialog.requiresReview")}
                </label>
              </>
            ) : null}
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                disabled={saving}
              />
              {tCommon("labels.active")}
            </label>
          </div>
        )}

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {tCommon("actions.close")}
          </Button>
          {mode === "edit" ? (
            <Button onClick={() => void handleSave()} disabled={saving || loading}>
              {saving ? tCommon("status.saving") : tCommon("labels.saveChanges")}
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CatalogRowActions({
  entityType,
  entityId,
  onView,
  onEdit,
}: {
  entityType: CatalogEntityType;
  entityId: number;
  onView: (type: CatalogEntityType, id: number) => void;
  onEdit: (type: CatalogEntityType, id: number) => void;
}) {
  const tCommon = useTranslations("common");

  return (
    <div className="flex flex-wrap gap-2">
      <Button size="sm" variant="outline" onClick={() => onView(entityType, entityId)}>
        {tCommon("actions.view")}
      </Button>
      <Button size="sm" onClick={() => onEdit(entityType, entityId)}>
        {tCommon("actions.edit")}
      </Button>
    </div>
  );
}

export { CatalogRowActions };
