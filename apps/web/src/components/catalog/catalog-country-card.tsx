import { Globe2 } from "lucide-react";

import type { Country } from "@mazad/api";
import { pickLocalized } from "@mazad/api";

type CatalogCountryCardProps = {
  country: Country;
  locale: string;
};

export function CatalogCountryCard({ country, locale }: CatalogCountryCardProps) {
  const name = pickLocalized(locale, country.name_ar, country.name_en);

  return (
    <div className="group h-full rounded-2xl border border-separator/60 bg-card p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-mazad-primary/20 hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mazad-primary/8 text-mazad-primary transition-colors group-hover:bg-mazad-primary group-hover:text-white">
          <Globe2 className="size-5" />
        </div>
        <div className="min-w-0">
          <p className="truncate font-semibold text-navy">{name}</p>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {country.code}
          </p>
        </div>
      </div>
    </div>
  );
}
