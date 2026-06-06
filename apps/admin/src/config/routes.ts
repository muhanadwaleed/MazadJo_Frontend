/** Staff app route paths (locale-agnostic — next-intl adds `/en` or `/ar`). */
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
  profile: "/profile",
} as const;

export const staffNavItems = [
  { labelKey: "nav.overview", href: routes.home, icon: "overview" as const },
  { labelKey: "nav.reviewAuctions", href: routes.auctionsReview, icon: "reviewAuctions" as const },
  { labelKey: "nav.publishAuctions", href: routes.auctionsPublish, icon: "publishAuctions" as const },
  { labelKey: "nav.cms", href: routes.cms, icon: "cms" as const },
  { labelKey: "nav.configuration", href: routes.configuration, icon: "configuration" as const },
  { labelKey: "nav.catalog", href: routes.catalog, icon: "catalog" as const },
  { labelKey: "nav.users", href: routes.users, icon: "users" as const },
  { labelKey: "nav.auditLog", href: routes.audit, icon: "auditLog" as const },
] as const;
