"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  ApiError,
  getApiErrorMessage,
  staffService,
  type AuctionDetail,
  type AuctionReviewChecklistItem,
  type AuditLogEntry,
  type StaffReviewDecision,
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

function ReviewChecklist({
  auctionId,
  items,
  onToggle,
  togglingId,
}: {
  auctionId: number;
  items: AuctionReviewChecklistItem[];
  onToggle: (rowId: number, checked: boolean) => void;
  togglingId: number | null;
}) {
  const t = useTranslations("auctions.review");

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noChecklistGated")}</p>;
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.id} className="flex items-start gap-2 text-sm">
          <input
            id={`checklist-${auctionId}-${item.id}`}
            type="checkbox"
            className="mt-1 size-4 rounded border-input"
            checked={item.is_checked}
            disabled={togglingId === item.id}
            onChange={(e) => onToggle(item.id, e.target.checked)}
          />
          <label htmlFor={`checklist-${auctionId}-${item.id}`} className="leading-snug">
            {item.label_en || item.label_ar}
          </label>
        </li>
      ))}
    </ul>
  );
}

function AuditTrail({ entries, loading }: { entries: AuditLogEntry[]; loading: boolean }) {
  const t = useTranslations("auctions.review");

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loadingAuditTrail")}</p>;
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noAuditEntries")}</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {entries.map((entry) => (
        <li key={entry.id} className="rounded-md border px-3 py-2">
          <div className="font-medium">{entry.action}</div>
          <div className="text-muted-foreground">
            {new Date(entry.created_at).toLocaleString()}
          </div>
        </li>
      ))}
    </ul>
  );
}

function ReviewAuctionCard({
  auction,
  onReviewed,
}: {
  auction: AuctionDetail;
  onReviewed: () => void;
}) {
  const t = useTranslations("auctions.review");
  const [checklist, setChecklist] = useState<AuctionReviewChecklistItem[]>([]);
  const [checklistLoading, setChecklistLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [reason, setReason] = useState("");
  const [busyDecision, setBusyDecision] = useState<StaffReviewDecision | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);
  const [auditEntries, setAuditEntries] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  const loadChecklist = useCallback(async () => {
    setChecklistLoading(true);
    try {
      const rows = await staffService.getReviewChecklist(auction.id);
      setChecklist(rows);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadChecklistFailed")
      );
    } finally {
      setChecklistLoading(false);
    }
  }, [auction.id, t]);

  useEffect(() => {
    void loadChecklist();
  }, [loadChecklist]);

  const allChecked = useMemo(
    () => checklist.length === 0 || checklist.every((row) => row.is_checked),
    [checklist]
  );

  async function toggleChecklist(rowId: number, checked: boolean) {
    setTogglingId(rowId);
    try {
      const updated = await staffService.patchReviewChecklist(auction.id, {
        id: rowId,
        is_checked: checked,
      });
      setChecklist((prev) =>
        prev.map((row) => (row.id === rowId ? { ...row, ...updated } : row))
      );
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.updateChecklistFailed")
      );
    } finally {
      setTogglingId(null);
    }
  }

  async function review(decision: StaffReviewDecision) {
    setBusyDecision(decision);
    try {
      await staffService.staffReview(auction.id, {
        decision,
        reason: reason.trim() || undefined,
      });
      toast.success(
        t("toast.reviewSuccess", {
          id: auction.id,
          decision: t(`decisions.${decision}`),
        })
      );
      setReason("");
      onReviewed();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.reviewFailed")
      );
    } finally {
      setBusyDecision(null);
    }
  }

  async function loadAudit() {
    setAuditOpen(true);
    setAuditLoading(true);
    try {
      const data = await staffService.listAuditLogs({
        entity_type: "auction",
        entity_id: auction.id,
        page_size: 20,
      });
      setAuditEntries(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadAuditFailed")
      );
    } finally {
      setAuditLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="text-base">{auction.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            {t("auctionMeta", { number: auction.auction_number, seller: auction.seller })}
          </p>
        </div>
        <Badge variant="outline">{auction.status}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="mb-2 text-sm font-medium">{t("reviewChecklist")}</h3>
          {checklistLoading ? (
            <p className="text-sm text-muted-foreground">{t("loadingChecklist")}</p>
          ) : (
            <ReviewChecklist
              auctionId={auction.id}
              items={checklist}
              onToggle={(rowId, checked) => void toggleChecklist(rowId, checked)}
              togglingId={togglingId}
            />
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor={`review-reason-${auction.id}`}>{t("reasonLabel")}</Label>
          <Input
            id={`review-reason-${auction.id}`}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder={t("reasonPlaceholder")}
            disabled={busyDecision !== null}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            disabled={busyDecision !== null || !allChecked}
            onClick={() => void review("approve")}
            title={!allChecked ? t("approveAllRequired") : undefined}
          >
            {busyDecision === "approve" ? t("approving") : t("approve")}
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={busyDecision !== null}
            onClick={() => void review("return_for_edit")}
          >
            {busyDecision === "return_for_edit" ? t("returning") : t("returnForEdit")}
          </Button>
          <Button
            size="sm"
            variant="destructive"
            disabled={busyDecision !== null}
            onClick={() => void review("reject")}
          >
            {busyDecision === "reject" ? t("rejecting") : t("reject")}
          </Button>
          <Button size="sm" variant="ghost" onClick={() => void loadAudit()}>
            {t("auditTrail")}
          </Button>
        </div>

        {auditOpen ? (
          <div className="rounded-md border p-3">
            <h3 className="mb-2 text-sm font-medium">{t("auditTrail")}</h3>
            <AuditTrail entries={auditEntries} loading={auditLoading} />
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function StaffAuctionsReviewPanel() {
  const t = useTranslations("auctions.review");
  const [auctions, setAuctions] = useState<AuctionDetail[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffService.listPendingAuctions();
      setAuctions(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadAuctionsFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loadingAuctions")}</p>;
  }

  if (auctions.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noAuctions")}</p>;
  }

  return (
    <div className="space-y-4">
      {auctions.map((auction) => (
        <ReviewAuctionCard key={auction.id} auction={auction} onReviewed={load} />
      ))}
    </div>
  );
}
