export type Faq = {
  id: number;
  question_ar: string;
  question_en: string;
  answer_ar: string;
  answer_en: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type WhoUs = {
  id: number;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type WhyUs = {
  id: number;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

export type ContactUs = {
  id: number;
  phone: string;
  email: string;
  address_ar: string;
  address_en: string;
  social_links_json: Record<string, string> | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
