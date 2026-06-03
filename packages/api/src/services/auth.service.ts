import { api } from "../client";
import { endpoints } from "../endpoints";
import type {
  LoginPayload,
  RegisterPayload,
  TokenPair,
  UserProfile,
} from "../types";
import { clearTokens, setTokens } from "@mazad/auth/session";

const JORDAN_COUNTRY_CODE = "+962";

export type RegisterInput = {
  username: string;
  password: string;
  email?: string;
  full_name_en?: string;
  phone_number?: string;
  country_code?: string;
};

function buildRegisterBody(input: RegisterInput): RegisterPayload {
  const body: RegisterPayload = {
    username: input.username.trim(),
    password: input.password,
    country_code: input.country_code ?? JORDAN_COUNTRY_CODE,
  };

  const email = (input.email?.trim() ?? "").toLowerCase();
  if (email) body.email = email;

  const name = input.full_name_en?.trim();
  if (name) body.full_name_en = name;

  const phone = input.phone_number?.replace(/\D/g, "");
  if (phone) body.phone_number = phone;

  return body;
}

export const authService = {
  register(input: RegisterInput) {
    return api.post<UserProfile>(endpoints.auth.register, {
      body: buildRegisterBody(input),
      skipRefresh: true,
    });
  },

  async login(payload: LoginPayload) {
    const tokens = await api.post<TokenPair>(endpoints.auth.token, {
      body: {
        username: payload.username.trim(),
        password: payload.password,
      },
      skipRefresh: true,
    });
    setTokens(tokens);
    return tokens;
  },

  logout() {
    clearTokens();
  },

  requestPasswordReset(body: {
    destination_type: "phone" | "email";
    destination_value: string;
  }) {
    return api.post<{ detail: string; expires_in_minutes: number; expires_at: string }>(
      endpoints.auth.passwordResetRequest,
      { body, skipRefresh: true }
    );
  },

  requestOtp(body: {
    destination_type: "phone" | "email";
    destination_value: string;
    purpose?: "register";
  }) {
    return api.post<{
      detail: string;
      expires_in_minutes: number;
      expires_at: string;
    }>(endpoints.auth.otpRequest, {
      body: { purpose: "register", ...body },
      skipRefresh: true,
    });
  },

  verifyOtp(body: {
    destination_type: "phone" | "email";
    destination_value: string;
    code: string;
    purpose?: "register";
  }) {
    return api.post<{ detail: string }>(endpoints.auth.otpVerify, {
      body: { purpose: "register", ...body },
      skipRefresh: true,
    });
  },

  confirmPasswordReset(body: {
    destination_type: "phone" | "email";
    destination_value: string;
    code: string;
    new_password: string;
  }) {
    return api.post<{ detail: string }>(endpoints.auth.passwordResetConfirm, {
      body,
      skipRefresh: true,
    });
  },
};
