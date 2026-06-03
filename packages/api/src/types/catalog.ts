export type Country = {
  id: number;
  name_ar: string;
  name_en: string;
  code: string;
  is_active: boolean;
};

export type City = {
  id: number;
  country: number;
  name_ar: string;
  name_en: string;
  is_active: boolean;
};

export type Area = {
  id: number;
  city: number;
  name_ar: string;
  name_en: string;
  is_active: boolean;
};

export type CategoryFees = {
  bidder_insurance_amount: string;
  seller_insurance_amount: string;
  subscription_amount: string;
};

export type ProductSettings = {
  min_images_count: number;
  max_images_count: number;
  video_allowed: boolean;
  max_video_duration_sec: number | null;
  attachments_allowed: boolean;
  allowed_extensions_json: string[];
  location_link_enabled: boolean;
  min_start_price: string;
  min_bid_increment: string;
  reserve_price_required: boolean;
  inspection_required: boolean;
  blur_option_enabled: boolean;
  delivery_period_days: number;
  auction_extension_enabled: boolean;
  extension_minutes: number;
  extension_trigger_seconds: number;
  is_active: boolean;
};

export type ProductCategory = {
  id: number;
  name_ar: string;
  name_en: string;
  category_type: string;
  requires_review: boolean;
  requires_transfer_process: boolean;
  requires_inspection: boolean;
  is_active: boolean;
  settings?: ProductSettings;
  fees?: CategoryFees;
};

export type ProductCategoryWrite = {
  name_ar: string;
  name_en: string;
  category_type?: string;
  requires_review?: boolean;
  requires_transfer_process?: boolean;
  requires_inspection?: boolean;
  is_active?: boolean;
  fees_configuration: number;
  settings?: Partial<ProductSettings>;
};
