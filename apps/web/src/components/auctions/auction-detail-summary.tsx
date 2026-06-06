import { Clock, Eye, Users } from "lucide-react";

import type { AuctionDetail } from "@mazad/api";
import { CountdownTimer, Card, CardContent, Separator } from "@mazad/ui";

type AuctionDetailSummaryProps = {
  auction: AuctionDetail;
  formatted: {
    currentPrice: string;
    startingPrice: string;
    minIncrement: string;
    startsAt: string;
    endsAt: string;
  };
  labels: {
    currentPrice: string;
    startingPrice: string;
    minIncrement: string;
    starts: string;
    ends: string;
    participants: string;
    views: string;
    countdown: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
  actions: React.ReactNode;
};

export function AuctionDetailSummary({
  auction,
  formatted,
  labels,
  actions,
}: AuctionDetailSummaryProps) {
  const isLive = auction.status === "active";

  return (
    <Card className="overflow-hidden border-mazad-border-subtle p-0 shadow-lg">
      <div className="border-b border-separator bg-gradient-to-br from-mazad-primary/6 via-card to-light-blue/8 px-6 py-6">
        <p className="text-xs font-semibold tracking-widest text-mazad-primary uppercase">
          #{auction.auction_number}
        </p>
        <p className="mt-3 text-sm font-medium text-muted-foreground">
          {labels.currentPrice}
        </p>
        <p className="text-3xl font-bold tracking-tight text-navy sm:text-4xl">
          {formatted.currentPrice}
        </p>
      </div>

      <CardContent className="space-y-5 p-6">
        {isLive ? (
          <div className="rounded-xl border border-mazad-accent/20 bg-mazad-accent/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-mazad-accent">
              <Clock className="size-4" aria-hidden />
              {labels.ends}
            </div>
            <CountdownTimer endsAt={auction.ends_at} labels={labels.countdown} />
          </div>
        ) : null}

        <dl className="grid gap-2.5 text-sm">
          {[
            { label: labels.startingPrice, value: formatted.startingPrice },
            { label: labels.minIncrement, value: formatted.minIncrement },
            { label: labels.starts, value: formatted.startsAt, muted: true },
            { label: labels.ends, value: formatted.endsAt, muted: true },
          ].map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-separator/60 bg-surface/60 px-3.5 py-2.5"
            >
              <dt className="text-muted-foreground">{row.label}</dt>
              <dd
                className={
                  row.muted ? "font-medium text-foreground" : "font-semibold text-navy"
                }
              >
                {row.value}
              </dd>
            </div>
          ))}
        </dl>

        <Separator />

        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-mazad-primary" aria-hidden />
            {labels.participants}:{" "}
            <strong className="text-navy">{auction.participants_count}</strong>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Eye className="size-4 text-mazad-primary" aria-hidden />
            {labels.views}:{" "}
            <strong className="text-navy">{auction.views_count}</strong>
          </span>
        </div>

        <div className="space-y-2.5 pt-1">{actions}</div>
      </CardContent>
    </Card>
  );
}
