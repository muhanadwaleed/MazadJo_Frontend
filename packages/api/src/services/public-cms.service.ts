import { serverApi } from "../client";
import { endpoints } from "../endpoints";
import type {
  ContactUs,
  Faq,
  ListParams,
  PaginatedResponse,
  TermsAndConditions,
  WhoUs,
  WhyUs,
} from "../types";

export const publicCmsService = {
  faqs(params?: ListParams) {
    return serverApi.get<PaginatedResponse<Faq> | Faq[]>(endpoints.cms.faqs, {
      params,
    });
  },

  whoUs(params?: ListParams) {
    return serverApi.get<PaginatedResponse<WhoUs> | WhoUs[]>(endpoints.cms.whoUs, {
      params,
    });
  },

  whyUs(params?: ListParams) {
    return serverApi.get<PaginatedResponse<WhyUs> | WhyUs[]>(endpoints.cms.whyUs, {
      params,
    });
  },

  contactActive() {
    return serverApi.get<ContactUs>(endpoints.cms.contactUsActive);
  },

  termsActive() {
    return serverApi.get<TermsAndConditions>(endpoints.configuration.termsActive);
  },
};
