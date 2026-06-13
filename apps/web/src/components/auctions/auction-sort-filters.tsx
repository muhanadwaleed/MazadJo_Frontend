import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@mazad/ui/utils";

export type AuctionSortValue =
  | "newest"
  | "ending_soon"
  | "price_low"
  | "price_high";

const SORT_OPTIONS: { value: AuctionSortValue; key: AuctionSortValue }[] = [
  { value: "newest", key: "newest" },
  { value: "ending_soon", key: "ending_soon" },
  { value: "price_low", key: "price_low" },
  { value: "price_high", key: "price_high" },
];

type AuctionSortFiltersProps = {
  currentSort?: string;
  status?: string;
  search?: string;
};

export async function AuctionSortFilters({
  currentSort = "newest",
  status,
  search,
}: AuctionSortFiltersProps) {
  const t = await getTranslations("auctions");

  function buildHref(sort: AuctionSortValue) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    return qs ? `/auctions?${qs}` : "/auctions";
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {t("sortLabel")}
      </span>
      {SORT_OPTIONS.map(({ value, key }) => {
        const active = currentSort === value;
        return (
          <Link
            key={key}
            href={buildHref(value)}
            scroll={false}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-200",
              active
                ? "border-mazad-primary bg-mazad-primary/10 text-mazad-primary"
                : "border-separator bg-card text-navy hover:border-mazad-primary/30"
            )}
          >
            {t(`sort.${key}`)}
          </Link>
        );
      })}
    </div>
  );
}

export function sortAuctions<
  T extends { current_price: string; starts_at: string | null; ends_at: string | null },
>(
  auctions: T[],
  sort: AuctionSortValue = "newest"
): T[] {
  const copy = [...auctions];
  const timeOrMax = (value: string | null) =>
    value ? new Date(value).getTime() : Number.MAX_SAFE_INTEGER;
  const timeOrZero = (value: string | null) =>
    value ? new Date(value).getTime() : 0;

  switch (sort) {
    case "ending_soon":
      return copy.sort(
        (a, b) => timeOrMax(a.ends_at) - timeOrMax(b.ends_at)
      );
    case "price_low":
      return copy.sort(
        (a, b) =>
          Number.parseFloat(a.current_price) - Number.parseFloat(b.current_price)
      );
    case "price_high":
      return copy.sort(
        (a, b) =>
          Number.parseFloat(b.current_price) - Number.parseFloat(a.current_price)
      );
    case "newest":
    default:
      return copy.sort(
        (a, b) => timeOrZero(b.starts_at) - timeOrZero(a.starts_at)
      );
  }
}
