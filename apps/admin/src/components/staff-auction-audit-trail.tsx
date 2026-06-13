"use client";

import { useTranslations } from "next-intl";

import type { AuditLogEntry } from "@mazad/api";

type StaffAuctionAuditTrailProps = {
  auctionNumber: string;
  entries: AuditLogEntry[];
  loading: boolean;
};

export function StaffAuctionAuditTrail({
  auctionNumber,
  entries,
  loading,
}: StaffAuctionAuditTrailProps) {
  const t = useTranslations("auctions.review");

  if (loading) {
    return <p className="text-sm text-muted-foreground">{t("loadingAuditTrail")}</p>;
  }

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">{t("noAuditEntries")}</p>;
  }

  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        {t("auditTrailScoped", { number: auctionNumber, count: entries.length })}
      </p>
      <ul className="space-y-2 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} className="rounded-md border px-3 py-2">
            <div className="font-medium">{entry.action}</div>
            <div className="mt-1 text-xs text-muted-foreground">
              {new Date(entry.created_at).toLocaleString()}
              {entry.actor_user != null ? (
                <span> · {t("auditActor", { id: entry.actor_user })}</span>
              ) : null}
            </div>
            {entry.new_values_json ? (
              <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 text-[11px]">
                {JSON.stringify(entry.new_values_json, null, 2)}
              </pre>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
