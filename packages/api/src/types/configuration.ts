export type FeesConfiguration = {
  id: number;
  name: string;
  bidder_insurance_amount: string;
  seller_insurance_amount: string;
  subscription_amount: string;
  category_count?: number;
  created_at?: string;
  updated_at?: string;
};

export type TermsAndConditions = {
  id: number;
  version: string;
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  is_active: boolean;
  effective_at: string;
  created_at?: string;
  updated_at?: string;
};

export type ReviewChecklistItem = {
  id: number;
  key: string;
  label_ar: string;
  label_en: string;
  sort_order: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};
