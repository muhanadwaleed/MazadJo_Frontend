"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError, getApiErrorMessage, staffService, type AuctionDetail } from "@mazad/api";
import { routes } from "@/config/routes";
import { Badge, Button, buttonVariants, Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

export function StaffAuctionsPublishPanel() {
  const t = useTranslations("auctions.publish");
  const [auctions, setAuctions] = useState<AuctionDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffService.listApprovedAuctions();
      setAuctions(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void load();
  }, [load]);

  async function publish(id: number) {
    setBusyId(id);
    try {
      await staffService.staffPublish(id);
      toast.success(t("toast.scheduled", { id }));
      await load();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.publishFailed")
      );
    } finally {
      setBusyId(null);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loading")}</p>;
  }

  if (auctions.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="space-y-4">
      {auctions.map((auction) => (
        <Card key={auction.id}>
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle className="text-base">{auction.title}</CardTitle>
              <p className="text-sm text-muted-foreground">#{auction.auction_number}</p>
            </div>
            <Badge variant="outline">{auction.status}</Badge>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              disabled={busyId === auction.id}
              onClick={() => void publish(auction.id)}
            >
              {t("publishSchedule")}
            </Button>
            <Link
              href={`${routes.audit}?entity_type=auction&entity_id=${auction.id}`}
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              {t("auditTrail")}
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
