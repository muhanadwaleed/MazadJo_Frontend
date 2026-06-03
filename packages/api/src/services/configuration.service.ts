import { api } from "../client";
import { endpoints } from "../endpoints";
import type {
  FeesConfiguration,
  ListParams,
  PaginatedResponse,
  ReviewChecklistItem,
  TermsAndConditions,
} from "../types";

export const configurationService = {
  listFees(params?: ListParams) {
    return api.get<PaginatedResponse<FeesConfiguration> | FeesConfiguration[]>(
      endpoints.configuration.fees,
      { params, auth: true }
    );
  },

  createFee(body: Partial<FeesConfiguration>) {
    return api.post<FeesConfiguration>(endpoints.configuration.fees, {
      body,
      auth: true,
    });
  },

  updateFee(id: string | number, body: Partial<FeesConfiguration>) {
    return api.patch<FeesConfiguration>(endpoints.configuration.fee(id), {
      body,
      auth: true,
    });
  },

  deleteFee(id: string | number) {
    return api.delete<void>(endpoints.configuration.fee(id), { auth: true });
  },

  listTerms(params?: ListParams) {
    return api.get<PaginatedResponse<TermsAndConditions> | TermsAndConditions[]>(
      endpoints.configuration.terms,
      { params, auth: true }
    );
  },

  createTerm(body: Partial<TermsAndConditions>) {
    return api.post<TermsAndConditions>(endpoints.configuration.terms, {
      body,
      auth: true,
    });
  },

  updateTerm(id: string | number, body: Partial<TermsAndConditions>) {
    return api.patch<TermsAndConditions>(endpoints.configuration.term(id), {
      body,
      auth: true,
    });
  },

  deleteTerm(id: string | number) {
    return api.delete<void>(endpoints.configuration.term(id), { auth: true });
  },

  listChecklistItems(params?: ListParams) {
    return api.get<PaginatedResponse<ReviewChecklistItem> | ReviewChecklistItem[]>(
      endpoints.configuration.checklistItems,
      { params, auth: true }
    );
  },

  createChecklistItem(body: Partial<ReviewChecklistItem>) {
    return api.post<ReviewChecklistItem>(endpoints.configuration.checklistItems, {
      body,
      auth: true,
    });
  },

  updateChecklistItem(id: string | number, body: Partial<ReviewChecklistItem>) {
    return api.patch<ReviewChecklistItem>(endpoints.configuration.checklistItem(id), {
      body,
      auth: true,
    });
  },

  deleteChecklistItem(id: string | number) {
    return api.delete<void>(endpoints.configuration.checklistItem(id), {
      auth: true,
    });
  },

  getCategoryChecklist(categoryId: string | number) {
    return api.get<ReviewChecklistItem[]>(
      endpoints.catalog.categoryChecklist(categoryId),
      { auth: true }
    );
  },

  assignCategoryChecklist(categoryId: string | number, checklistItemIds: number[]) {
    return api.put<ReviewChecklistItem[]>(
      endpoints.catalog.categoryChecklist(categoryId),
      { body: { checklist_item_ids: checklistItemIds }, auth: true }
    );
  },
};
