export type PaymentTransactionRecord = {
  id: number;
  provider_reference: string;
  status: string;
  amount: string;
  auction: number | null;
  subscription: number | null;
  created_at: string;
  updated_at: string;
};

export type PaymentListParams = {
  auction?: number;
  page?: number;
  page_size?: number;
};
