import { api, serverApi } from "../client";
import { endpoints } from "../endpoints";
import type { UserProfile } from "../types";

export const usersService = {
  me() {
    return api.get<UserProfile>(endpoints.users.me, { auth: true });
  },

  meServer() {
    return serverApi.get<UserProfile>(endpoints.users.me, { auth: true });
  },

  updateMe(body: Partial<UserProfile>) {
    return api.patch<UserProfile>(endpoints.users.me, { body, auth: true });
  },
};
