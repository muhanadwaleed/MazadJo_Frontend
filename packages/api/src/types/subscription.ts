export type SubscriptionStatus =
  | "pending_payment"
  | "active"
  | "cancelled"
  | "refunded"
  | string;

export type ParticipantType = "seller" | "bidder";

export type PaymentTransaction = {
  id: number;
  provider_reference: string;
  status: string;
  amount: string;
};

export type Subscription = {
  id: number;
  auction: number;
  status: SubscriptionStatus;
  insurance_fee: string;
  subscription_fee: string;
  total_fee: string;
  participant_type: ParticipantType;
  payment_transaction: PaymentTransaction | null;
  created_at?: string;
  updated_at?: string;
};

export type CreateSubscriptionPayload = {
  auction: number;
};

export type SubscriptionListParams = {
  auction?: number;
  status?: SubscriptionStatus | string;
  page?: number;
  page_size?: number;
};
