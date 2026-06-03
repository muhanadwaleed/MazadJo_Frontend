"use client";

import { useState } from "react";

import type { Country } from "@mazad/api";
import { Card, CardContent, CardHeader, CardTitle } from "@mazad/ui";

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
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{labels.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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
        <p className="text-sm text-muted-foreground">
          {labels.selection}: {selectionSummary}
        </p>
      </CardContent>
    </Card>
  );
}
