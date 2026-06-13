import { Hash, MapPin, TrendingUp } from "lucide-react";

import type { AuctionDetail } from "@mazad/api";
import { Badge } from "@mazad/ui";

type AuctionDetailMetaProps = {
  auction: AuctionDetail;
  labels: {
    minIncrement: string;
    atAGlance: string;
  };
  formattedMinIncrement: string;
};

export function AuctionDetailMeta({
  auction,
  labels,
  formattedMinIncrement,
}: AuctionDetailMetaProps) {
  return (
    <section aria-label={labels.atAGlance}>
      <p className="mb-3 text-xs font-semibold tracking-widest text-mazad-primary uppercase">
        {labels.atAGlance}
      </p>
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="gap-1.5 font-normal">
          <Hash className="size-3.5" aria-hidden />
          {auction.auction_number}
        </Badge>
        <Badge variant="outline" className="gap-1.5 font-normal">
          <TrendingUp className="size-3.5" aria-hidden />
          {labels.minIncrement}: {formattedMinIncrement}
        </Badge>
        {auction.area ? (
          <Badge variant="outline" className="gap-1.5 font-normal">
            <MapPin className="size-3.5" aria-hidden />
            #{auction.area}
          </Badge>
        ) : null}
        {auction.location_link ? (
          <Badge variant="outline" className="max-w-full truncate font-normal">
            <MapPin className="size-3.5 shrink-0" aria-hidden />
            <span className="truncate">{auction.location_link}</span>
          </Badge>
        ) : null}
      </div>
    </section>
  );
}
