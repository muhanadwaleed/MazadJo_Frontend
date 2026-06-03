/** Central route paths — use for links and redirects. */
export const routes = {
  home: "/",
  auctions: "/auctions",
  auction: (id: string | number) => `/auctions/${id}`,
  auctionBids: (id: string | number) => `/auctions/${id}/bids`,
  catalog: "/catalog",
  catalogCategory: (id: string | number) => `/catalog/categories/${id}`,
  faq: "/faq",
  about: "/about",
  contact: "/contact",
  terms: "/terms",
  dashboard: "/dashboard",
  dashboardWatchlist: "/dashboard/watchlist",
  listingNew: "/dashboard/listings/new",
  listingEdit: (id: string | number) => `/dashboard/listings/${id}/edit`,
  profile: "/profile",
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  /** Reserved for Phase 6+ */
  notifications: "/notifications",
} as const;
