"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { ApiError, getApiErrorMessage, staffService, type AuditLogEntry } from "@mazad/api";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Label } from "@mazad/ui";

type StaffAuditPanelProps = {
  initialEntityId?: string;
  initialEntityType?: string;
};

export function StaffAuditPanel({
  initialEntityId = "",
  initialEntityType = "auction",
}: StaffAuditPanelProps) {
  const t = useTranslations("audit");
  const tCommon = useTranslations("common");
  const [entries, setEntries] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [entityType, setEntityType] = useState(initialEntityType);
  const [entityId, setEntityId] = useState(initialEntityId);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await staffService.listAuditLogs({
        entity_type: entityType.trim() || undefined,
        entity_id: entityId.trim() || undefined,
        page_size: 50,
      });
      setEntries(data.results ?? []);
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("toast.loadFailed")
      );
    } finally {
      setLoading(false);
    }
  }, [entityId, entityType, t]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto] sm:items-end">
        <div className="space-y-2">
          <Label htmlFor="audit-entity-type">{t("entityType")}</Label>
          <Input
            id="audit-entity-type"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            placeholder={t("entityTypePlaceholder")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="audit-entity-id">{t("entityId")}</Label>
          <Input
            id="audit-entity-id"
            value={entityId}
            onChange={(e) => setEntityId(e.target.value)}
            placeholder={t("entityIdPlaceholder")}
          />
        </div>
        <Button type="button" onClick={() => void load()} disabled={loading}>
          {tCommon("actions.filter")}
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">{t("loading")}</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-muted-foreground">{t("empty")}</p>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.id}>
              <CardHeader>
                <CardTitle className="text-base">{entry.action}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {t("entryMeta", {
                    entityType: entry.entity_type,
                    entityId: entry.entity_id,
                    date: new Date(entry.created_at).toLocaleString(),
                  })}
                </p>
              </CardHeader>
              {entry.new_values_json ? (
                <CardContent>
                  <pre className="overflow-x-auto rounded-md bg-muted p-3 text-xs">
                    {JSON.stringify(entry.new_values_json, null, 2)}
                  </pre>
                </CardContent>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
