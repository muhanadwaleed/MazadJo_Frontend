import { api } from "../client";
import { endpoints } from "../endpoints";
import type { AuctionDetail, PaginatedResponse } from "../types";
import type { ContactUs, Faq, WhoUs, WhyUs } from "../types/cms";

export type StaffReviewDecision = "approve" | "reject" | "return_for_edit";

export type StaffReviewPayload = {
  decision: StaffReviewDecision;
  reason?: string;
};

export type AuctionReviewChecklistItem = {
  id: number;
  checklist_item: number;
  label_ar: string;
  label_en: string;
  is_checked: boolean;
  checked_by: number | null;
  checked_at: string | null;
};

export type AuditLogEntry = {
  id: number;
  action: string;
  actor_user: number | null;
  entity_type: string;
  entity_id: string;
  old_values_json: Record<string, unknown> | null;
  new_values_json: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

export const staffService = {
  listPendingAuctions() {
    return api.get<PaginatedResponse<AuctionDetail>>(endpoints.auctions.list, {
      params: { status: "under_review" },
      auth: true,
    });
  },

  staffReview(id: string | number, body: StaffReviewPayload) {
    return api.post<AuctionDetail>(endpoints.auctions.staffReview(id), {
      body,
      auth: true,
    });
  },

  staffCancel(id: string | number, reason?: string) {
    return api.post<AuctionDetail>(endpoints.auctions.staffCancel(id), {
      body: reason ? { reason } : undefined,
      auth: true,
    });
  },

  getReviewChecklist(id: string | number) {
    return api.get<AuctionReviewChecklistItem[]>(
      endpoints.auctions.reviewChecklist(id),
      { auth: true }
    );
  },

  patchReviewChecklist(
    id: string | number,
    body: { id: number; is_checked: boolean }
  ) {
    return api.patch<AuctionReviewChecklistItem>(
      endpoints.auctions.reviewChecklist(id),
      { body, auth: true }
    );
  },

  listAuditLogs(params?: {
    entity_type?: string;
    entity_id?: string | number;
    page?: number;
    page_size?: number;
  }) {
    return api.get<PaginatedResponse<AuditLogEntry>>(endpoints.audit.list, {
      params,
      auth: true,
    });
  },
};

export const cmsService = {
  listFaqs() {
    return api.get<PaginatedResponse<Faq>>(endpoints.cms.faqs, { auth: true });
  },

  createFaq(body: Partial<Faq>) {
    return api.post<Faq>(endpoints.cms.faqs, { body, auth: true });
  },

  updateFaq(id: string | number, body: Partial<Faq>) {
    return api.patch<Faq>(endpoints.cms.faq(id), { body, auth: true });
  },

  deleteFaq(id: string | number) {
    return api.delete<void>(endpoints.cms.faq(id), { auth: true });
  },

  listWhoUs() {
    return api.get<PaginatedResponse<WhoUs>>(endpoints.cms.whoUs, { auth: true });
  },

  createWhoUs(body: Partial<WhoUs>) {
    return api.post<WhoUs>(endpoints.cms.whoUs, { body, auth: true });
  },

  updateWhoUs(id: string | number, body: Partial<WhoUs>) {
    return api.patch<WhoUs>(endpoints.cms.whoUsItem(id), { body, auth: true });
  },

  deleteWhoUs(id: string | number) {
    return api.delete<void>(endpoints.cms.whoUsItem(id), { auth: true });
  },

  listWhyUs() {
    return api.get<PaginatedResponse<WhyUs>>(endpoints.cms.whyUs, { auth: true });
  },

  createWhyUs(body: Partial<WhyUs>) {
    return api.post<WhyUs>(endpoints.cms.whyUs, { body, auth: true });
  },

  updateWhyUs(id: string | number, body: Partial<WhyUs>) {
    return api.patch<WhyUs>(endpoints.cms.whyUsItem(id), { body, auth: true });
  },

  deleteWhyUs(id: string | number) {
    return api.delete<void>(endpoints.cms.whyUsItem(id), { auth: true });
  },

  listContactUs() {
    return api.get<PaginatedResponse<ContactUs>>(endpoints.cms.contactUs, {
      auth: true,
    });
  },

  createContactUs(body: Partial<ContactUs>) {
    return api.post<ContactUs>(endpoints.cms.contactUs, { body, auth: true });
  },

  updateContactUs(id: string | number, body: Partial<ContactUs>) {
    return api.patch<ContactUs>(endpoints.cms.contactUsItem(id), {
      body,
      auth: true,
    });
  },

  deleteContactUs(id: string | number) {
    return api.delete<void>(endpoints.cms.contactUsItem(id), { auth: true });
  },
};
