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
  type FeesConfiguration,
  type ProductCategory,
  type ReviewChecklistItem,
  type TermsAndConditions,
} from "@mazad/api";
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

type Tab = "fees" | "terms" | "checklist" | "assign";

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const t = useTranslations("configuration");
  const tabs: { id: Tab; label: string }[] = [
    { id: "fees", label: t("tabs.fees") },
    { id: "terms", label: t("tabs.terms") },
    { id: "checklist", label: t("tabs.checklist") },
    { id: "assign", label: t("tabs.assign") },
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

function FeesTab() {
  const t = useTranslations("configuration");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<FeesConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [bidder, setBidder] = useState("1");
  const [seller, setSeller] = useState("1");
  const [subscription, setSubscription] = useState("5");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await configurationService.listFees();
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
    if (!name.trim()) {
      toast.error(t("toast.nameRequired"));
      return;
    }
    setBusy(true);
    try {
      await configurationService.createFee({
        name: name.trim(),
        bidder_insurance_amount: bidder,
        seller_insurance_amount: seller,
        subscription_amount: subscription,
      });
      setName("");
      toast.success(t("toast.feeGroupCreated"));
      await load();
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
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("newFeeGroup")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("name")}</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("bidderInsurance")}</Label>
            <Input value={bidder} onChange={(e) => setBidder(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("sellerInsurance")}</Label>
            <Input value={seller} onChange={(e) => setSeller(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("subscription")}</Label>
            <Input
              value={subscription}
              onChange={(e) => setSubscription(e.target.value)}
              disabled={busy}
            />
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
          {items.map((fee) => (
            <Card key={fee.id}>
              <CardHeader>
                <CardTitle className="text-base">{fee.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("feeSummary", {
                    amount: fee.subscription_amount,
                    count: fee.category_count ?? 0,
                  })}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function TermsTab() {
  const t = useTranslations("configuration");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<TermsAndConditions[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [version, setVersion] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [bodyEn, setBodyEn] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await configurationService.listTerms();
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
    if (!version.trim() || !titleEn.trim() || !bodyEn.trim()) {
      toast.error(t("toast.termsFieldsRequired"));
      return;
    }
    setBusy(true);
    try {
      await configurationService.createTerm({
        version: version.trim(),
        title_en: titleEn.trim(),
        title_ar: titleEn.trim(),
        body_en: bodyEn.trim(),
        body_ar: bodyEn.trim(),
        is_active: false,
        effective_at: new Date().toISOString(),
      });
      setVersion("");
      setTitleEn("");
      setBodyEn("");
      toast.success(t("toast.termsCreated"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function activate(id: number) {
    setBusy(true);
    try {
      await configurationService.updateTerm(id, { is_active: true });
      toast.success(t("toast.termsActivated"));
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
          <CardTitle className="text-base">{t("newTermsVersion")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="space-y-2">
            <Label>{t("version")}</Label>
            <Input value={version} onChange={(e) => setVersion(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("titleEn")}</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("bodyEn")}</Label>
            <Input value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} disabled={busy} />
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
          {items.map((term) => (
            <Card key={term.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-base">
                    {term.version} — {term.title_en}
                  </CardTitle>
                </div>
                <Badge variant={term.is_active ? "default" : "outline"}>
                  {term.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              {!term.is_active ? (
                <CardContent>
                  <Button size="sm" disabled={busy} onClick={() => void activate(term.id)}>
                    {t("setActive")}
                  </Button>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistTab() {
  const t = useTranslations("configuration");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<ReviewChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [key, setKey] = useState("");
  const [labelEn, setLabelEn] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await configurationService.listChecklistItems();
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
    if (!key.trim() || !labelEn.trim()) {
      toast.error(t("toast.keyLabelRequired"));
      return;
    }
    setBusy(true);
    try {
      await configurationService.createChecklistItem({
        key: key.trim(),
        label_en: labelEn.trim(),
        label_ar: labelEn.trim(),
        sort_order: items.length,
        is_active: true,
      });
      setKey("");
      setLabelEn("");
      toast.success(t("toast.checklistItemCreated"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: ReviewChecklistItem) {
    setBusy(true);
    try {
      await configurationService.updateChecklistItem(item.id, {
        is_active: !item.is_active,
      });
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
          <CardTitle className="text-base">{t("newChecklistItem")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("key")}</Label>
            <Input value={key} onChange={(e) => setKey(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("labelEn")}</Label>
            <Input value={labelEn} onChange={(e) => setLabelEn(e.target.value)} disabled={busy} />
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
                  <CardTitle className="text-base">{item.label_en}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.key}</p>
                </div>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent>
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

function AssignTab() {
  const t = useTranslations("configuration");
  const tCommon = useTranslations("common");
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [checklistItems, setChecklistItems] = useState<ReviewChecklistItem[]>([]);
  const [categoryId, setCategoryId] = useState<number | "">("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const loadMeta = useCallback(async () => {
    setLoading(true);
    try {
      const [cats, items] = await Promise.all([
        catalogStaffService.listCategories(),
        configurationService.listChecklistItems(),
      ]);
      setCategories(asList(cats));
      setChecklistItems(asList(items).filter((i) => i.is_active));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [tCommon]);

  useEffect(() => {
    void loadMeta();
  }, [loadMeta]);

  useEffect(() => {
    if (!categoryId) {
      setSelectedIds([]);
      return;
    }
    void (async () => {
      try {
        const assigned = await configurationService.getCategoryChecklist(categoryId);
        setSelectedIds(assigned.map((a) => a.id));
      } catch {
        setSelectedIds([]);
      }
    })();
  }, [categoryId]);

  function toggleId(id: number) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function save() {
    if (!categoryId) {
      toast.error(t("toast.selectCategory"));
      return;
    }
    setBusy(true);
    try {
      await configurationService.assignCategoryChecklist(categoryId, selectedIds);
      toast.success(t("toast.checklistAssigned"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.saveFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{tCommon("status.loading")}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t("assignChecklist")}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>{t("category")}</Label>
          <select
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            value={categoryId}
            onChange={(e) =>
              setCategoryId(e.target.value ? Number(e.target.value) : "")
            }
          >
            <option value="">{t("selectCategory")}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name_en}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>{t("checklistItems")}</Label>
          <ul className="space-y-2">
            {checklistItems.map((item) => (
              <li key={item.id} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(item.id)}
                  onChange={() => toggleId(item.id)}
                  disabled={!categoryId || busy}
                />
                {t("checklistItemMeta", { label: item.label_en, key: item.key })}
              </li>
            ))}
          </ul>
        </div>
        <Button size="sm" disabled={busy || !categoryId} onClick={() => void save()}>
          {t("saveAssignment")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function StaffConfigurationPanel() {
  const [tab, setTab] = useState<Tab>("fees");

  return (
    <div className="space-y-6">
      <TabBar active={tab} onChange={setTab} />
      {tab === "fees" ? <FeesTab /> : null}
      {tab === "terms" ? <TermsTab /> : null}
      {tab === "checklist" ? <ChecklistTab /> : null}
      {tab === "assign" ? <AssignTab /> : null}
    </div>
  );
}
