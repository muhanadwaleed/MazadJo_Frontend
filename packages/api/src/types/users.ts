export type StaffUser = {
  id: number;
  username: string;
  email: string;
  user_type: string;
  is_staff: boolean;
  is_active: boolean;
  full_name_ar: string;
  full_name_en: string;
  phone_number: string;
  country_code: string;
  gender: string;
  date_of_birth: string | null;
  profile_image: string;
  is_phone_verified: boolean;
  is_email_verified: boolean;
  is_blocked: boolean;
  is_shadow_banned: boolean;
  date_joined: string;
  updated_at: string;
};

export type StaffUserUpdatePayload = Partial<{
  full_name_ar: string;
  full_name_en: string;
  email: string;
  phone_number: string;
  country_code: string;
  gender: string;
  date_of_birth: string | null;
  profile_image: string;
  user_type: string;
  is_staff: boolean;
  is_active: boolean;
  is_blocked: boolean;
  is_shadow_banned: boolean;
}>;
