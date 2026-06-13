import { api } from "../client";
import { endpoints } from "../endpoints";
import type { PaginatedResponse } from "../types";
import type { CreateDisputePayload, Dispute } from "../types/disputes";

export const disputesService = {
  listClient(params?: { auction?: number; page?: number; page_size?: number }) {
    return api.get<PaginatedResponse<Dispute>>(endpoints.disputes.list, {
      params,
      auth: true,
    });
  },

  createClient(body: CreateDisputePayload) {
    return api.post<Dispute>(endpoints.disputes.list, { body, auth: true });
  },
};
