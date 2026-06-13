import { api } from "../client";
import { endpoints } from "../endpoints";
import type { PaginatedResponse } from "../types";
import type {
  CreateSubscriptionPayload,
  Subscription,
  SubscriptionListParams,
} from "../types/subscription";

export const subscriptionsService = {
  listClient(params?: SubscriptionListParams) {
    return api.get<PaginatedResponse<Subscription>>(endpoints.subscriptions.list, {
      params,
      auth: true,
    });
  },

  createClient(body: CreateSubscriptionPayload, idempotencyKey?: string) {
    return api.post<Subscription>(endpoints.subscriptions.list, {
      body,
      auth: true,
      idempotencyKey,
    });
  },

  markPaidClient(id: string | number) {
    return api.post<Subscription>(endpoints.subscriptions.markPaid(id), {
      auth: true,
    });
  },
};
