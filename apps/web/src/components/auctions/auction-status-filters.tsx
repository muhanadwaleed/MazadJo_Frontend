import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/navigation";
import { cn } from "@mazad/ui/utils";

const STATUS_FILTERS = [
  { value: undefined, key: "all" as const },
  { value: "active", key: "active" as const },
  { value: "scheduled", key: "scheduled" as const },
  { value: "ended", key: "ended" as const },
] as const;

type AuctionStatusFiltersProps = {
  currentStatus?: string;
  search?: string;
  sort?: string;
};

export async function AuctionStatusFilters({
  currentStatus,
  search,
  sort,
}: AuctionStatusFiltersProps) {
  const t = await getTranslations("auctions");

  function buildHref(status?: string) {
    const params = new URLSearchParams();
    if (status) params.set("status", status);
    if (search) params.set("search", search);
    if (sort && sort !== "newest") params.set("sort", sort);
    const qs = params.toString();
    return qs ? `/auctions?${qs}` : "/auctions";
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUS_FILTERS.map(({ value, key }) => {
        const active =
          key === "ended"
            ? currentStatus === "ended" || currentStatus === "ended_without_bids"
            : (currentStatus ?? undefined) === value;
        const label = key === "all" ? t("filterAll") : t(`status.${key}`);

        return (
          <Link
            key={key}
            href={buildHref(value)}
            scroll={false}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200",
              active
                ? "scale-[1.02] bg-mazad-primary text-white shadow-sm"
                : "border border-separator bg-card text-navy hover:scale-[1.01] hover:border-mazad-primary/30 hover:text-mazad-primary"
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
