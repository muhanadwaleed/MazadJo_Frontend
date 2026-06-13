import { api } from "../client";
import { endpoints } from "../endpoints";
import type { PaginatedResponse } from "../types";
import type { PaymentListParams, PaymentTransactionRecord } from "../types/payment";

export const paymentsService = {
  listTransactionsClient(params?: PaymentListParams) {
    return api.get<PaginatedResponse<PaymentTransactionRecord>>(
      endpoints.payments.transactions,
      { params, auth: true }
    );
  },
};
