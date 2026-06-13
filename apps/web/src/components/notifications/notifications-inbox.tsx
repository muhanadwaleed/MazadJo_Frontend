"use client";

import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

import { asList, notificationsService, type NotificationItem } from "@mazad/api";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import { formatDateTime } from "@/lib/format";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";

export function NotificationsInbox() {
  const locale = useLocale();
  const t = useTranslations("notifications");
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingId, setMarkingId] = useState<number | null>(null);

  useEffect(() => {
    void notificationsService
      .list({ page_size: 30 })
      .then((data) => setItems(asList(data)))
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  async function markRead(id: number) {
    setMarkingId(id);
    try {
      await notificationsService.markRead(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_read: true } : item))
      );
    } finally {
      setMarkingId(null);
    }
  }

  if (loading) return <LoadingGrid count={2} className="grid-cols-1" />;
  if (error) return <ErrorState message={error} />;

  if (items.length === 0) {
    return (
      <EmptyState title={t("emptyTitle")} description={t("emptyDescription")} />
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <Card key={item.id} className={item.is_read ? "opacity-80" : undefined}>
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 pb-2">
            <CardTitle className="text-base">{item.title}</CardTitle>
            <time className="shrink-0 text-xs text-muted-foreground">
              {formatDateTime(item.created_at, locale)}
            </time>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">{item.body}</p>
            {!item.is_read ? (
              <Button
                size="sm"
                variant="outline"
                disabled={markingId === item.id}
                onClick={() => void markRead(item.id)}
              >
                {markingId === item.id ? t("markingRead") : t("markRead")}
              </Button>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
