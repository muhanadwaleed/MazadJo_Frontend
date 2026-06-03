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
} from "@mazad/api";
import {
  CatalogRecordDialog,
  CatalogRowActions,
  type CatalogEntityType,
} from "@/components/staff-catalog-record-dialog";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "@mazad/ui";

type Tab = "countries" | "cities" | "areas" | "categories";

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm";

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const t = useTranslations("catalog");
  const tabs: { id: Tab; label: string }[] = [
    { id: "countries", label: t("tabs.countries") },
    { id: "cities", label: t("tabs.cities") },
    { id: "areas", label: t("tabs.areas") },
    { id: "categories", label: t("tabs.categories") },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b pb-3">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          size="sm"
          variant={active === tab.id ? "default" : "outline"}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </Button>
      ))}
    </div>
  );
}

type CatalogDialogState = {
  open: boolean;
  mode: "view" | "edit";
  entityType: CatalogEntityType;
  entityId: number | null;
};

function useCatalogDialog() {
  const [dialog, setDialog] = useState<CatalogDialogState>({
    open: false,
    mode: "view",
    entityType: "country",
    entityId: null,
  });

  function openView(entityType: CatalogEntityType, entityId: number) {
    setDialog({ open: true, mode: "view", entityType, entityId });
  }

  function openEdit(entityType: CatalogEntityType, entityId: number) {
    setDialog({ open: true, mode: "edit", entityType, entityId });
  }

  function closeDialog() {
    setDialog((prev) => ({ ...prev, open: false }));
  }

  return { dialog, openView, openEdit, closeDialog };
}

function CountriesTab({
  onView,
  onEdit,
}: {
  onView: (type: CatalogEntityType, id: number) => void;
  onEdit: (type: CatalogEntityType, id: number) => void;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [code, setCode] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await catalogStaffService.listCountries();
      setItems(asList(data));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!nameEn.trim() || !code.trim()) {
      toast.error(t("toast.countryNameCodeRequired"));
      return;
    }
    setBusy(true);
    try {
      await catalogStaffService.createCountry({
        name_en: nameEn.trim(),
        name_ar: nameAr.trim() || nameEn.trim(),
        code: code.trim().toUpperCase(),
        is_active: true,
      });
      setNameEn("");
      setNameAr("");
      setCode("");
      toast.success(t("toast.countryCreated"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: Country) {
    setBusy(true);
    try {
      await catalogStaffService.updateCountry(item.id, { is_active: !item.is_active });
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.updateFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addCountry")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="space-y-2">
            <Label>{tCommon("labels.nameEn")}</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{tCommon("labels.nameAr")}</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{tCommon("labels.code")}</Label>
            <Input value={code} onChange={(e) => setCode(e.target.value)} disabled={busy} />
          </div>
          <Button size="sm" disabled={busy} onClick={() => void create()}>
            {tCommon("actions.create")}
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {item.name_en} ({item.code})
                  </CardTitle>
                </div>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <CatalogRowActions
                  entityType="country"
                  entityId={item.id}
                  onView={onView}
                  onEdit={onEdit}
                />
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void toggle(item)}>
                  {item.is_active ? tCommon("actions.deactivate") : tCommon("actions.activate")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CitiesTab({
  onView,
  onEdit,
}: {
  onView: (type: CatalogEntityType, id: number) => void;
  onEdit: (type: CatalogEntityType, id: number) => void;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [countries, setCountries] = useState<Country[]>([]);
  const [items, setItems] = useState<City[]>([]);
  const [countryId, setCountryId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");

  const loadCountries = useCallback(async () => {
    const data = await catalogStaffService.listCountries();
    setCountries(asList(data));
  }, []);

  const loadCities = useCallback(async (filterCountry?: number) => {
    setLoading(true);
    try {
      const data = await catalogStaffService.listCities(
        filterCountry ? { country: filterCountry } : undefined
      );
      setItems(asList(data));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    void loadCountries();
  }, [loadCountries]);

  useEffect(() => {
    void loadCities(countryId || undefined);
  }, [countryId, loadCities]);

  async function create() {
    if (!countryId || !nameEn.trim()) {
      toast.error(t("toast.countryCityRequired"));
      return;
    }
    setBusy(true);
    try {
      await catalogStaffService.createCity({
        country: countryId,
        name_en: nameEn.trim(),
        name_ar: nameAr.trim() || nameEn.trim(),
        is_active: true,
      });
      setNameEn("");
      setNameAr("");
      toast.success(t("toast.cityCreated"));
      await loadCities(countryId);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("filterByCountry")}</Label>
        <select
          className={selectClassName}
          value={countryId}
          onChange={(e) => setCountryId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">{t("allCountries")}</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en}
            </option>
          ))}
        </select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addCity")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tCommon("labels.nameEn")}</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{tCommon("labels.nameAr")}</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={busy} />
          </div>
          <Button size="sm" disabled={busy} onClick={() => void create()}>
            {tCommon("actions.create")}
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle className="text-base">{item.name_en}</CardTitle>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent>
                <CatalogRowActions
                  entityType="city"
                  entityId={item.id}
                  onView={onView}
                  onEdit={onEdit}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function AreasTab({
  onView,
  onEdit,
}: {
  onView: (type: CatalogEntityType, id: number) => void;
  onEdit: (type: CatalogEntityType, id: number) => void;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [cities, setCities] = useState<City[]>([]);
  const [items, setItems] = useState<Area[]>([]);
  const [cityId, setCityId] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");

  useEffect(() => {
    void catalogStaffService.listCities().then((data) => setCities(asList(data)));
  }, []);

  const loadAreas = useCallback(async (filterCity?: number) => {
    setLoading(true);
    try {
      const data = await catalogStaffService.listAreas(
        filterCity ? { city: filterCity } : undefined
      );
      setItems(asList(data));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    void loadAreas(cityId || undefined);
  }, [cityId, loadAreas]);

  async function create() {
    if (!cityId || !nameEn.trim()) {
      toast.error(t("toast.cityAreaRequired"));
      return;
    }
    setBusy(true);
    try {
      await catalogStaffService.createArea({
        city: cityId,
        name_en: nameEn.trim(),
        name_ar: nameAr.trim() || nameEn.trim(),
        is_active: true,
      });
      setNameEn("");
      setNameAr("");
      toast.success(t("toast.areaCreated"));
      await loadAreas(cityId);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>{t("filterByCity")}</Label>
        <select
          className={selectClassName}
          value={cityId}
          onChange={(e) => setCityId(e.target.value ? Number(e.target.value) : "")}
        >
          <option value="">{t("allCities")}</option>
          {cities.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name_en}
            </option>
          ))}
        </select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addArea")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tCommon("labels.nameEn")}</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{tCommon("labels.nameAr")}</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={busy} />
          </div>
          <Button size="sm" disabled={busy} onClick={() => void create()}>
            {tCommon("actions.create")}
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle className="text-base">{item.name_en}</CardTitle>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent>
                <CatalogRowActions
                  entityType="area"
                  entityId={item.id}
                  onView={onView}
                  onEdit={onEdit}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function CategoriesTab({
  onView,
  onEdit,
}: {
  onView: (type: CatalogEntityType, id: number) => void;
  onEdit: (type: CatalogEntityType, id: number) => void;
}) {
  const t = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<ProductCategory[]>([]);
  const [fees, setFees] = useState<FeesConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [nameEn, setNameEn] = useState("");
  const [nameAr, setNameAr] = useState("");
  const [categoryType, setCategoryType] = useState("general");
  const [feesId, setFeesId] = useState<number | "">("");
  const [minImages, setMinImages] = useState("3");
  const [maxImages, setMaxImages] = useState("12");
  const [minStartPrice, setMinStartPrice] = useState("5");
  const [minBidIncrement, setMinBidIncrement] = useState("5");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, feeList] = await Promise.all([
        catalogStaffService.listCategories(),
        configurationService.listFees(),
      ]);
      setItems(asList(cats));
      const feeItems = asList(feeList);
      setFees(feeItems);
      if (feeItems.length > 0) {
        setFeesId((prev) => prev || feeItems[0].id);
      }
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!nameEn.trim() || !feesId) {
      toast.error(t("toast.nameFeeRequired"));
      return;
    }
    setBusy(true);
    try {
      await catalogStaffService.createCategory({
        name_en: nameEn.trim(),
        name_ar: nameAr.trim() || nameEn.trim(),
        category_type: categoryType.trim(),
        requires_review: true,
        is_active: true,
        fees_configuration: feesId,
        settings: {
          min_images_count: Number(minImages) || 1,
          max_images_count: Number(maxImages) || 10,
          video_allowed: false,
          min_start_price: minStartPrice,
          min_bid_increment: minBidIncrement,
          delivery_period_days: 7,
          is_active: true,
        },
      });
      setNameEn("");
      setNameAr("");
      toast.success(t("toast.categoryCreated"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: ProductCategory) {
    setBusy(true);
    try {
      await catalogStaffService.updateCategory(item.id, { is_active: !item.is_active });
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.updateFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addCategory")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{tCommon("labels.nameEn")}</Label>
            <Input value={nameEn} onChange={(e) => setNameEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{tCommon("labels.nameAr")}</Label>
            <Input value={nameAr} onChange={(e) => setNameAr(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("categoryType")}</Label>
            <Input
              value={categoryType}
              onChange={(e) => setCategoryType(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("feeGroup")}</Label>
            <select
              className={selectClassName}
              value={feesId}
              onChange={(e) => setFeesId(Number(e.target.value))}
              disabled={busy}
            >
              {fees.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label>{t("minImages")}</Label>
            <Input value={minImages} onChange={(e) => setMinImages(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("maxImages")}</Label>
            <Input value={maxImages} onChange={(e) => setMaxImages(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("minStartPrice")}</Label>
            <Input
              value={minStartPrice}
              onChange={(e) => setMinStartPrice(e.target.value)}
              disabled={busy}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("minBidIncrement")}</Label>
            <Input
              value={minBidIncrement}
              onChange={(e) => setMinBidIncrement(e.target.value)}
              disabled={busy}
            />
          </div>
          <Button size="sm" disabled={busy} onClick={() => void create()}>
            {t("createCategory")}
          </Button>
        </CardContent>
      </Card>
      {loading ? (
        <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">{item.name_en}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.category_type}</p>
                </div>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                <CatalogRowActions
                  entityType="category"
                  entityId={item.id}
                  onView={onView}
                  onEdit={onEdit}
                />
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void toggle(item)}>
                  {item.is_active ? tCommon("actions.deactivate") : tCommon("actions.activate")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export function StaffCatalogPanel() {
  const [tab, setTab] = useState<Tab>("countries");
  const [reloadKey, setReloadKey] = useState(0);
  const { dialog, openView, openEdit, closeDialog } = useCatalogDialog();

  function handleSaved() {
    setReloadKey((k) => k + 1);
  }

  return (
    <div className="space-y-6">
      <TabBar active={tab} onChange={setTab} />
      {tab === "countries" ? (
        <CountriesTab key={`countries-${reloadKey}`} onView={openView} onEdit={openEdit} />
      ) : null}
      {tab === "cities" ? (
        <CitiesTab key={`cities-${reloadKey}`} onView={openView} onEdit={openEdit} />
      ) : null}
      {tab === "areas" ? (
        <AreasTab key={`areas-${reloadKey}`} onView={openView} onEdit={openEdit} />
      ) : null}
      {tab === "categories" ? (
        <CategoriesTab key={`categories-${reloadKey}`} onView={openView} onEdit={openEdit} />
      ) : null}

      <CatalogRecordDialog
        open={dialog.open}
        mode={dialog.mode}
        entityType={dialog.entityType}
        entityId={dialog.entityId}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
        onSaved={handleSaved}
      />
    </div>
  );
}
