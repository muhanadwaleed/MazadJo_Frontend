"use client";

import { Clock, Eye, Users } from "lucide-react";
import { isAuctionEndedStatus } from "@mazad/api";
import type { AuctionDetail } from "@mazad/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CountdownTimer,
  Separator,
} from "@mazad/ui";
import { PlaceBidForm } from "@/components/auctions/place-bid-form";
import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";

type AuctionBidPanelProps = {
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
    viewAllBids: string;
    statusLabel: string;
    scheduledMessage: string;
    endedMessage: string;
    endedNoBidsMessage: string;
    cancelledMessage: string;
    countdown: {
      days: string;
      hours: string;
      minutes: string;
      seconds: string;
    };
  };
};

export function AuctionBidPanel({
  auction,
  formatted,
  labels,
}: AuctionBidPanelProps) {
  const isLive = auction.status === "active";
  const isScheduled = auction.status === "scheduled";
  const isEnded = isAuctionEndedStatus(auction.status);
  const isCancelled = auction.status === "cancelled";

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
        {isLive && auction.ends_at ? (
          <div className="rounded-xl border border-mazad-accent/20 bg-mazad-accent/5 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-mazad-accent">
              <Clock className="size-4" aria-hidden />
              {labels.ends}
            </div>
            <CountdownTimer endsAt={auction.ends_at} labels={labels.countdown} />
          </div>
        ) : null}

        {isScheduled ? (
          <div className="rounded-xl border border-mazad-primary/20 bg-mazad-primary/5 p-4 text-sm">
            <p className="font-semibold text-navy">{labels.scheduledMessage}</p>
            <p className="mt-2 text-muted-foreground">
              {labels.starts}: {formatted.startsAt}
            </p>
          </div>
        ) : null}

        {isEnded ? (
          <div className="rounded-xl border border-separator bg-surface p-4 text-sm">
            <p className="font-semibold text-navy">
              {auction.status === "ended_without_bids"
                ? labels.endedNoBidsMessage
                : labels.endedMessage}
            </p>
            <p className="mt-2 text-muted-foreground">
              {labels.ends}: {formatted.endsAt}
            </p>
          </div>
        ) : null}

        {isCancelled ? (
          <div className="rounded-xl border border-separator bg-surface p-4 text-sm">
            <p className="font-semibold text-navy">{labels.cancelledMessage}</p>
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

        <div className="space-y-3 pt-1">
          {isLive ? (
            <PlaceBidForm
              embedded
              auctionId={String(auction.id)}
              currentPrice={auction.current_price}
              minIncrement={auction.min_bid_increment}
              status={auction.status}
            />
          ) : (
            <Card className="border-separator/60 shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-base text-navy">{labels.statusLabel}</CardTitle>
                <CardDescription>
                  {!isLive && !isScheduled && !isEnded && !isCancelled
                    ? auction.status
                    : null}
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          <Link
            href={routes.auctionBids(auction.id)}
            className="block text-center text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
          >
            {labels.viewAllBids}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
