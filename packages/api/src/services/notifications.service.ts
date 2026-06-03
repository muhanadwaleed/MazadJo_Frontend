import { api } from "../client";
import { endpoints } from "../endpoints";
import type { ListParams, PaginatedResponse } from "../types";

/** Stub for Phase 6 — list + mark read wired to API when UI ships. */
export type NotificationItem = {
  id: number;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
};

export const notificationsService = {
  list(params?: ListParams) {
    return api.get<PaginatedResponse<NotificationItem>>(
      endpoints.notifications.list,
      { params, auth: true }
    );
  },

  markRead(id: string | number) {
    return api.patch(endpoints.notifications.read(id), { auth: true });
  },
};
