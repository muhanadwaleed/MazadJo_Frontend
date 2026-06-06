"use client";

import { useState } from "react";

import type { Country } from "@mazad/api";
import { Card, CardContent } from "@mazad/ui";

import { LocationPicker } from "./location-picker";

type LocationExplorerProps = {
  locale: string;
  countries: Country[];
  labels: {
    title: string;
    country: string;
    city: string;
    area: string;
    selectCountry: string;
    selectCity: string;
    selectArea: string;
    loading: string;
    selection: string;
    none: string;
  };
};

export function LocationExplorer({ locale, countries, labels }: LocationExplorerProps) {
  const [countryId, setCountryId] = useState<number | null>(null);
  const [cityId, setCityId] = useState<number | null>(null);
  const [areaId, setAreaId] = useState<number | null>(null);

  const selectionSummary =
    [countryId, cityId, areaId].filter(Boolean).join(" → ") || labels.none;

  return (
    <Card className="border-separator/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardContent className="space-y-4 p-5 md:p-6">
        <LocationPicker
          locale={locale}
          countries={countries}
          countryId={countryId}
          cityId={cityId}
          areaId={areaId}
          onCountryChange={setCountryId}
          onCityChange={setCityId}
          onAreaChange={setAreaId}
          labels={labels}
        />
        <p className="rounded-xl border border-dashed border-separator bg-surface/60 px-4 py-3 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{labels.selection}:</span>{" "}
          {selectionSummary}
        </p>
      </CardContent>
    </Card>
  );
}
