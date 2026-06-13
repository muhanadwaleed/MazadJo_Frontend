/** Path segments relative to `/api/v1` */
export const endpoints = {
  auth: {
    register: "/auth/register/",
    token: "/auth/token/",
    refresh: "/auth/token/refresh/",
    verify: "/auth/token/verify/",
    otpRequest: "/auth/otp/request/",
    otpVerify: "/auth/otp/verify/",
    passwordResetRequest: "/auth/password/reset/request/",
    passwordResetConfirm: "/auth/password/reset/confirm/",
  },
  users: {
    me: "/users/me/",
    list: "/users/",
    detail: (id: string | number) => `/users/${id}/`,
  },
  catalog: {
    countries: "/countries/",
    country: (id: string | number) => `/countries/${id}/`,
    cities: "/cities/",
    city: (id: string | number) => `/cities/${id}/`,
    areas: "/areas/",
    area: (id: string | number) => `/areas/${id}/`,
    categories: "/categories/",
    category: (id: string | number) => `/categories/${id}/`,
    categoryChecklist: (id: string | number) => `/categories/${id}/checklist-items/`,
  },
  auctions: {
    list: "/auctions/",
    detail: (id: string | number) => `/auctions/${id}/`,
    bids: (id: string | number) => `/auctions/${id}/bids/`,
    placeBid: (id: string | number) => `/auctions/${id}/bids/`,
    watchlist: (id: string | number) => `/auctions/${id}/watchlist/`,
    submit: (id: string | number) => `/auctions/${id}/submit/`,
    cancel: (id: string | number) => `/auctions/${id}/cancel/`,
    staffReview: (id: string | number) => `/auctions/${id}/staff/review/`,
    staffCancel: (id: string | number) => `/auctions/${id}/staff/cancel/`,
    reviewChecklist: (id: string | number) => `/auctions/${id}/review-checklist/`,
    media: (id: string | number) => `/auctions/${id}/media/`,
    mediaItem: (id: string | number, mediaId: string | number) =>
      `/auctions/${id}/media/${mediaId}/`,
  },
  watchlist: {
    list: "/watchlist/",
  },
  subscriptions: {
    list: "/subscriptions/",
    markPaid: (id: string | number) => `/subscriptions/${id}/mark_paid/`,
  },
  payments: {
    transactions: "/payments/transactions/",
  },
  ratings: {
    list: "/ratings/",
  },
  disputes: {
    list: "/disputes/",
  },
  notifications: {
    list: "/notifications/",
    read: (id: string | number) => `/notifications/${id}/read/`,
  },
  cms: {
    faqs: "/faqs/",
    faq: (id: string | number) => `/faqs/${id}/`,
    whoUs: "/who-us/",
    whoUsItem: (id: string | number) => `/who-us/${id}/`,
    whyUs: "/why-us/",
    whyUsItem: (id: string | number) => `/why-us/${id}/`,
    contactUs: "/contact-us/",
    contactUsItem: (id: string | number) => `/contact-us/${id}/`,
    contactUsActive: "/contact-us/active/",
  },
  configuration: {
    fees: "/fees-configurations/",
    fee: (id: string | number) => `/fees-configurations/${id}/`,
    checklistItems: "/checklist-items/",
    checklistItem: (id: string | number) => `/checklist-items/${id}/`,
    terms: "/terms/",
    term: (id: string | number) => `/terms/${id}/`,
    termsActive: "/terms/active/",
  },
  audit: {
    list: "/audit-logs/",
  },
} as const;
