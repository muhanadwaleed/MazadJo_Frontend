export type TokenPair = {
  access: string;
  refresh: string;
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_staff: boolean;
  full_name_ar: string;
  full_name_en: string;
  phone_number: string;
  country_code: string;
  gender: string | null;
  date_of_birth: string | null;
  profile_image: string | null;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_blocked: boolean;
  date_joined: string;
  updated_at: string;
};

export type RegisterPayload = {
  username: string;
  password: string;
  email?: string;
  full_name_ar?: string;
  full_name_en?: string;
  phone_number?: string;
  country_code?: string;
};

export type LoginPayload = {
  username: string;
  password: string;
};
