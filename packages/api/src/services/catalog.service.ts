import { api, serverApi } from "../client";
import { endpoints } from "../endpoints";
import type {
  Area,
  City,
  Country,
  ListParams,
  PaginatedResponse,
  ProductCategory,
} from "../types";

export const catalogService = {
  countries(params?: ListParams) {
    return serverApi.get<PaginatedResponse<Country> | Country[]>(
      endpoints.catalog.countries,
      { params }
    );
  },

  cities(params?: ListParams & { country?: number }) {
    return serverApi.get<PaginatedResponse<City> | City[]>(
      endpoints.catalog.cities,
      { params }
    );
  },

  areas(params?: ListParams & { city?: number }) {
    return serverApi.get<PaginatedResponse<Area> | Area[]>(
      endpoints.catalog.areas,
      { params }
    );
  },

  categories(params?: ListParams) {
    return serverApi.get<PaginatedResponse<ProductCategory> | ProductCategory[]>(
      endpoints.catalog.categories,
      { params }
    );
  },

  category(id: string | number) {
    return serverApi.get<ProductCategory>(endpoints.catalog.category(id));
  },
};

/** Client-side catalog reads (browser / client components). */
export const catalogClientService = {
  countries(params?: ListParams) {
    return api.get<PaginatedResponse<Country> | Country[]>(
      endpoints.catalog.countries,
      { params }
    );
  },

  cities(params?: ListParams & { country?: number }) {
    return api.get<PaginatedResponse<City> | City[]>(endpoints.catalog.cities, {
      params,
    });
  },

  areas(params?: ListParams & { city?: number }) {
    return api.get<PaginatedResponse<Area> | Area[]>(endpoints.catalog.areas, {
      params,
    });
  },

  area(id: string | number) {
    return api.get<Area>(endpoints.catalog.area(id));
  },

  city(id: string | number) {
    return api.get<City>(endpoints.catalog.city(id));
  },

  categories(params?: ListParams) {
    return api.get<PaginatedResponse<ProductCategory> | ProductCategory[]>(
      endpoints.catalog.categories,
      { params }
    );
  },

  category(id: string | number) {
    return api.get<ProductCategory>(endpoints.catalog.category(id));
  },
};
