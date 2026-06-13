import { api } from "../client";
import { endpoints } from "../endpoints";
import type { PaginatedResponse } from "../types";
import type { CreateRatingPayload, Rating } from "../types/ratings";

export const ratingsService = {
  listClient(params?: { auction?: number; page?: number; page_size?: number }) {
    return api.get<PaginatedResponse<Rating>>(endpoints.ratings.list, {
      params,
      auth: true,
    });
  },

  createClient(body: CreateRatingPayload) {
    return api.post<Rating>(endpoints.ratings.list, { body, auth: true });
  },
};
