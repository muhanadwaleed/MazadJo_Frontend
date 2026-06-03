import { api } from "../client";
import { endpoints } from "../endpoints";
import type { ListParams, PaginatedResponse } from "../types";
import type { StaffUser, StaffUserUpdatePayload } from "../types/users";

export type StaffUserListParams = ListParams & {
  is_staff?: boolean | string;
  is_blocked?: boolean | string;
  is_active?: boolean | string;
  search?: string;
};

function boolParam(value: boolean | string | undefined) {
  if (value === undefined) return undefined;
  if (typeof value === "boolean") return value ? "1" : "0";
  return value;
}

export const staffUsersService = {
  list(params?: StaffUserListParams) {
    return api.get<PaginatedResponse<StaffUser>>(endpoints.users.list, {
      auth: true,
      params: {
        ...params,
        is_staff: boolParam(params?.is_staff),
        is_blocked: boolParam(params?.is_blocked),
        is_active: boolParam(params?.is_active),
      },
    });
  },

  get(id: string | number) {
    return api.get<StaffUser>(endpoints.users.detail(id), { auth: true });
  },

  update(id: string | number, body: StaffUserUpdatePayload) {
    return api.patch<StaffUser>(endpoints.users.detail(id), { body, auth: true });
  },
};
