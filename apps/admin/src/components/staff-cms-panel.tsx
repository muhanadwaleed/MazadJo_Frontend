"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  cmsService,
  getApiErrorMessage,
  type ContactUs,
  type Faq,
  type WhoUs,
  type WhyUs,
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

type Tab = "faqs" | "whoUs" | "whyUs" | "contact";

function TabBar({ active, onChange }: { active: Tab; onChange: (tab: Tab) => void }) {
  const t = useTranslations("cms");
  const tabs: { id: Tab; label: string }[] = [
    { id: "faqs", label: t("tabs.faqs") },
    { id: "whoUs", label: t("tabs.whoUs") },
    { id: "whyUs", label: t("tabs.whyUs") },
    { id: "contact", label: t("tabs.contact") },
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

function FaqsTab() {
  const t = useTranslations("cms");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<Faq[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [questionEn, setQuestionEn] = useState("");
  const [questionAr, setQuestionAr] = useState("");
  const [answerEn, setAnswerEn] = useState("");
  const [answerAr, setAnswerAr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsService.listFaqs();
      setItems(data.results ?? []);
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
    if (!questionEn.trim() || !answerEn.trim()) {
      toast.error(t("toast.faqEnRequired"));
      return;
    }
    setBusy(true);
    try {
      await cmsService.createFaq({
        question_en: questionEn.trim(),
        question_ar: questionAr.trim() || questionEn.trim(),
        answer_en: answerEn.trim(),
        answer_ar: answerAr.trim() || answerEn.trim(),
        is_active: true,
        sort_order: items.length,
      });
      setQuestionEn("");
      setQuestionAr("");
      setAnswerEn("");
      setAnswerAr("");
      toast.success(t("toast.faqCreated"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: Faq) {
    setBusy(true);
    try {
      await cmsService.updateFaq(item.id, { is_active: !item.is_active });
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.updateFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setBusy(true);
    try {
      await cmsService.deleteFaq(id);
      toast.success(t("toast.faqDeleted"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.deleteFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addFaq")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("questionEn")}</Label>
            <Input value={questionEn} onChange={(e) => setQuestionEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("questionAr")}</Label>
            <Input value={questionAr} onChange={(e) => setQuestionAr(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("answerEn")}</Label>
            <Input value={answerEn} onChange={(e) => setAnswerEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("answerAr")}</Label>
            <Input value={answerAr} onChange={(e) => setAnswerAr(e.target.value)} disabled={busy} />
          </div>
          <Button size="sm" disabled={busy} onClick={() => void create()}>
            {t("createFaq")}
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
                  <CardTitle className="text-base">{item.question_en}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.answer_en}</p>
                </div>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void toggle(item)}>
                  {item.is_active ? tCommon("actions.deactivate") : tCommon("actions.activate")}
                </Button>
                <Button size="sm" variant="destructive" disabled={busy} onClick={() => void remove(item.id)}>
                  {tCommon("actions.delete")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentBlockTab({
  type,
}: {
  type: "whoUs" | "whyUs";
}) {
  const t = useTranslations("cms");
  const tCommon = useTranslations("common");
  const [items, setItems] = useState<(WhoUs | WhyUs)[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [titleEn, setTitleEn] = useState("");
  const [titleAr, setTitleAr] = useState("");
  const [bodyEn, setBodyEn] = useState("");
  const [bodyAr, setBodyAr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data =
        type === "whoUs" ? await cmsService.listWhoUs() : await cmsService.listWhyUs();
      setItems(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [type, tCommon]);

  useEffect(() => {
    void load();
  }, [load]);

  async function create() {
    if (!titleEn.trim() || !bodyEn.trim()) {
      toast.error(t("toast.contentEnRequired"));
      return;
    }
    setBusy(true);
    const payload = {
      title_en: titleEn.trim(),
      title_ar: titleAr.trim() || titleEn.trim(),
      body_en: bodyEn.trim(),
      body_ar: bodyAr.trim() || bodyEn.trim(),
      is_active: true,
      sort_order: items.length,
    };
    try {
      if (type === "whoUs") await cmsService.createWhoUs(payload);
      else await cmsService.createWhyUs(payload);
      setTitleEn("");
      setTitleAr("");
      setBodyEn("");
      setBodyAr("");
      toast.success(t("toast.created"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.createFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function toggle(item: WhoUs | WhyUs) {
    setBusy(true);
    try {
      if (type === "whoUs") {
        await cmsService.updateWhoUs(item.id, { is_active: !item.is_active });
      } else {
        await cmsService.updateWhyUs(item.id, { is_active: !item.is_active });
      }
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.updateFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    setBusy(true);
    try {
      if (type === "whoUs") await cmsService.deleteWhoUs(id);
      else await cmsService.deleteWhyUs(id);
      toast.success(t("toast.deleted"));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : tCommon("toast.deleteFailed")
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("addBlock")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-2">
            <Label>{t("titleEn")}</Label>
            <Input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2">
            <Label>{t("titleAr")}</Label>
            <Input value={titleAr} onChange={(e) => setTitleAr(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("bodyEn")}</Label>
            <Input value={bodyEn} onChange={(e) => setBodyEn(e.target.value)} disabled={busy} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("bodyAr")}</Label>
            <Input value={bodyAr} onChange={(e) => setBodyAr(e.target.value)} disabled={busy} />
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
                  <CardTitle className="text-base">{item.title_en}</CardTitle>
                  <p className="text-sm text-muted-foreground">{item.body_en}</p>
                </div>
                <Badge variant={item.is_active ? "default" : "outline"}>
                  {item.is_active ? tCommon("status.active") : tCommon("status.inactive")}
                </Badge>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" disabled={busy} onClick={() => void toggle(item)}>
                  {item.is_active ? tCommon("actions.deactivate") : tCommon("actions.activate")}
                </Button>
                <Button size="sm" variant="destructive" disabled={busy} onClick={() => void remove(item.id)}>
                  {tCommon("actions.delete")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ContactTab() {
  const t = useTranslations("cms");
  const tCommon = useTranslations("common");
  const [records, setRecords] = useState<ContactUs[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [addressAr, setAddressAr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsService.listContactUs();
      const list = data.results ?? [];
      setRecords(list);
      const active = list.find((r) => r.is_active) ?? list[0];
      if (active) {
        setPhone(active.phone);
        setEmail(active.email);
        setAddressEn(active.address_en);
        setAddressAr(active.address_ar);
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

  async function save() {
    if (!phone.trim() || !email.trim()) {
      toast.error(t("toast.phoneEmailRequired"));
      return;
    }
    setBusy(true);
    const body = {
      phone: phone.trim(),
      email: email.trim(),
      address_en: addressEn.trim(),
      address_ar: addressAr.trim() || addressEn.trim(),
      is_active: true,
      social_links_json: {},
    };
    try {
      const active = records.find((r) => r.is_active);
      if (active) {
        await cmsService.updateContactUs(active.id, body);
        toast.success(t("toast.contactUpdated"));
      } else {
        await cmsService.createContactUs(body);
        toast.success(t("toast.contactCreated"));
      }
      await load();
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
        <CardTitle className="text-base">{t("contactDetails")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>{tCommon("labels.phone")}</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} disabled={busy} />
        </div>
        <div className="space-y-2">
          <Label>{tCommon("labels.email")}</Label>
          <Input value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} />
        </div>
        <div className="space-y-2">
          <Label>{t("addressEn")}</Label>
          <Input value={addressEn} onChange={(e) => setAddressEn(e.target.value)} disabled={busy} />
        </div>
        <div className="space-y-2">
          <Label>{t("addressAr")}</Label>
          <Input value={addressAr} onChange={(e) => setAddressAr(e.target.value)} disabled={busy} />
        </div>
        <Button size="sm" disabled={busy} onClick={() => void save()}>
          {t("saveContact")}
        </Button>
      </CardContent>
    </Card>
  );
}

export function StaffCmsPanel() {
  const [tab, setTab] = useState<Tab>("faqs");

  return (
    <div className="space-y-6">
      <TabBar active={tab} onChange={setTab} />
      {tab === "faqs" ? <FaqsTab /> : null}
      {tab === "whoUs" ? <ContentBlockTab type="whoUs" /> : null}
      {tab === "whyUs" ? <ContentBlockTab type="whyUs" /> : null}
      {tab === "contact" ? <ContactTab /> : null}
    </div>
  );
}
