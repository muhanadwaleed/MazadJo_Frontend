import { api } from "../client";
import { endpoints } from "../endpoints";
import type {
  Area,
  City,
  Country,
  ListParams,
  PaginatedResponse,
  ProductCategory,
  ProductCategoryWrite,
} from "../types";

export const catalogStaffService = {
  listCountries(params?: ListParams) {
    return api.get<PaginatedResponse<Country> | Country[]>(
      endpoints.catalog.countries,
      { params, auth: true }
    );
  },

  createCountry(body: Partial<Country>) {
    return api.post<Country>(endpoints.catalog.countries, { body, auth: true });
  },

  getCountry(id: string | number) {
    return api.get<Country>(endpoints.catalog.country(id), { auth: true });
  },

  updateCountry(id: string | number, body: Partial<Country>) {
    return api.patch<Country>(endpoints.catalog.country(id), { body, auth: true });
  },

  deleteCountry(id: string | number) {
    return api.delete<void>(endpoints.catalog.country(id), { auth: true });
  },

  listCities(params?: ListParams & { country?: number }) {
    return api.get<PaginatedResponse<City> | City[]>(endpoints.catalog.cities, {
      params,
      auth: true,
    });
  },

  createCity(body: Partial<City>) {
    return api.post<City>(endpoints.catalog.cities, { body, auth: true });
  },

  getCity(id: string | number) {
    return api.get<City>(endpoints.catalog.city(id), { auth: true });
  },

  updateCity(id: string | number, body: Partial<City>) {
    return api.patch<City>(endpoints.catalog.city(id), { body, auth: true });
  },

  deleteCity(id: string | number) {
    return api.delete<void>(endpoints.catalog.city(id), { auth: true });
  },

  listAreas(params?: ListParams & { city?: number }) {
    return api.get<PaginatedResponse<Area> | Area[]>(endpoints.catalog.areas, {
      params,
      auth: true,
    });
  },

  createArea(body: Partial<Area>) {
    return api.post<Area>(endpoints.catalog.areas, { body, auth: true });
  },

  getArea(id: string | number) {
    return api.get<Area>(endpoints.catalog.area(id), { auth: true });
  },

  updateArea(id: string | number, body: Partial<Area>) {
    return api.patch<Area>(endpoints.catalog.area(id), { body, auth: true });
  },

  deleteArea(id: string | number) {
    return api.delete<void>(endpoints.catalog.area(id), { auth: true });
  },

  listCategories(params?: ListParams) {
    return api.get<PaginatedResponse<ProductCategory> | ProductCategory[]>(
      endpoints.catalog.categories,
      { params, auth: true }
    );
  },

  getCategory(id: string | number) {
    return api.get<ProductCategory>(endpoints.catalog.category(id), { auth: true });
  },

  createCategory(body: ProductCategoryWrite) {
    return api.post<ProductCategory>(endpoints.catalog.categories, {
      body,
      auth: true,
    });
  },

  updateCategory(id: string | number, body: Partial<ProductCategoryWrite>) {
    return api.patch<ProductCategory>(endpoints.catalog.category(id), {
      body,
      auth: true,
    });
  },

  deleteCategory(id: string | number) {
    return api.delete<void>(endpoints.catalog.category(id), { auth: true });
  },
};
