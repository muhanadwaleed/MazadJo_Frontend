"use client";

import { useCallback, useEffect, useState } from "react";

import {
  asList,
  catalogClientService,
  pickLocalized,
  type Area,
  type City,
  type Country,
} from "@mazad/api";
import { Label } from "@mazad/ui";

type LocationPickerProps = {
  locale: string;
  countries: Country[];
  countryId?: number | null;
  cityId?: number | null;
  areaId?: number | null;
  onCountryChange?: (id: number | null) => void;
  onCityChange?: (id: number | null) => void;
  onAreaChange?: (id: number | null) => void;
  labels: {
    country: string;
    city: string;
    area: string;
    selectCountry: string;
    selectCity: string;
    selectArea: string;
    loading: string;
  };
};

const selectClassName =
  "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function LocationPicker({
  locale,
  countries,
  countryId,
  cityId,
  areaId,
  onCountryChange,
  onCityChange,
  onAreaChange,
  labels,
}: LocationPickerProps) {
  const [cities, setCities] = useState<City[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingAreas, setLoadingAreas] = useState(false);

  const loadCities = useCallback(async (selectedCountryId: number) => {
    setLoadingCities(true);
    try {
      const data = await catalogClientService.cities({ country: selectedCountryId });
      setCities(asList(data));
    } catch {
      setCities([]);
    } finally {
      setLoadingCities(false);
    }
  }, []);

  const loadAreas = useCallback(async (selectedCityId: number) => {
    setLoadingAreas(true);
    try {
      const data = await catalogClientService.areas({ city: selectedCityId });
      setAreas(asList(data));
    } catch {
      setAreas([]);
    } finally {
      setLoadingAreas(false);
    }
  }, []);

  useEffect(() => {
    if (!countryId) {
      setCities([]);
      setAreas([]);
      return;
    }
    void loadCities(countryId);
  }, [countryId, loadCities]);

  useEffect(() => {
    if (!cityId) {
      setAreas([]);
      return;
    }
    void loadAreas(cityId);
  }, [cityId, loadAreas]);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="space-y-2">
        <Label htmlFor="location-country">{labels.country}</Label>
        <select
          id="location-country"
          className={selectClassName}
          value={countryId ?? ""}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : null;
            onCountryChange?.(value);
            onCityChange?.(null);
            onAreaChange?.(null);
          }}
        >
          <option value="">{labels.selectCountry}</option>
          {countries.map((country) => (
            <option key={country.id} value={country.id}>
              {pickLocalized(locale, country.name_ar, country.name_en)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-city">{labels.city}</Label>
        <select
          id="location-city"
          className={selectClassName}
          value={cityId ?? ""}
          disabled={!countryId || loadingCities}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : null;
            onCityChange?.(value);
            onAreaChange?.(null);
          }}
        >
          <option value="">
            {loadingCities ? labels.loading : labels.selectCity}
          </option>
          {cities.map((city) => (
            <option key={city.id} value={city.id}>
              {pickLocalized(locale, city.name_ar, city.name_en)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="location-area">{labels.area}</Label>
        <select
          id="location-area"
          className={selectClassName}
          value={areaId ?? ""}
          disabled={!cityId || loadingAreas}
          onChange={(e) => {
            const value = e.target.value ? Number(e.target.value) : null;
            onAreaChange?.(value);
          }}
        >
          <option value="">
            {loadingAreas ? labels.loading : labels.selectArea}
          </option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {pickLocalized(locale, area.name_ar, area.name_en)}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
