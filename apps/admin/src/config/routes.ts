/** Staff app route paths (no locale prefix). */
export const routes = {
  home: "/",
  login: "/login",
  auctionsReview: "/auctions/review",
  auctionsPublish: "/auctions/publish",
  cms: "/cms",
  configuration: "/configuration",
  catalog: "/catalog",
  users: "/users",
  audit: "/audit",
} as const;

export const staffNavItems = [
  { labelKey: "nav.overview", href: routes.home },
  { labelKey: "nav.reviewAuctions", href: routes.auctionsReview },
  { labelKey: "nav.publishAuctions", href: routes.auctionsPublish },
  { labelKey: "nav.cms", href: routes.cms },
  { labelKey: "nav.configuration", href: routes.configuration },
  { labelKey: "nav.catalog", href: routes.catalog },
  { labelKey: "nav.users", href: routes.users },
  { labelKey: "nav.auditLog", href: routes.audit },
] as const;
