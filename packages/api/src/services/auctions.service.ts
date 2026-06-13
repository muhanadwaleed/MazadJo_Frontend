import { api, serverApi } from "../client";
import { endpoints } from "../endpoints";
import type {
  AuctionDetail,
  AuctionListItem,
  AuctionMedia,
  AuctionWatchlistEntry,
  AuctionWritePayload,
  CursorPaginatedResponse,
  ListParams,
  PaginatedResponse,
  PlaceBidPayload,
  PlacedBid,
  PublicBid,
} from "../types";

export type AuctionListParams = ListParams & {
  status?: string;
  category?: number;
  search?: string;
  mine?: boolean | string;
};

export const auctionsService = {
  list(params?: AuctionListParams) {
    const query = {
      ...params,
      mine: params?.mine ? "1" : undefined,
    };
    return serverApi.get<PaginatedResponse<AuctionListItem>>(
      endpoints.auctions.list,
      { params: query }
    );
  },

  listClient(params?: AuctionListParams) {
    const query = {
      ...params,
      mine: params?.mine ? "1" : undefined,
    };
    return api.get<PaginatedResponse<AuctionListItem>>(endpoints.auctions.list, {
      params: query,
      auth: Boolean(params?.mine),
    });
  },

  get(id: string | number) {
    return serverApi.get<AuctionDetail>(endpoints.auctions.detail(id));
  },

  getClient(id: string | number) {
    return api.get<AuctionDetail>(endpoints.auctions.detail(id), {
      auth: true,
    });
  },

  bids(id: string | number, params?: { cursor?: string; page_size?: number; since?: string }) {
    return serverApi.get<CursorPaginatedResponse<PublicBid>>(
      endpoints.auctions.bids(id),
      { params }
    );
  },

  bidsClient(
    id: string | number,
    params?: { cursor?: string; page_size?: number; since?: string }
  ) {
    return api.get<CursorPaginatedResponse<PublicBid>>(endpoints.auctions.bids(id), {
      params,
    });
  },

  placeBid(
    id: string | number,
    payload: PlaceBidPayload,
    idempotencyKey?: string
  ) {
    return api.post<PlacedBid>(endpoints.auctions.placeBid(id), {
      body: payload,
      auth: true,
      idempotencyKey,
    });
  },

  listWatchlistClient(params?: ListParams) {
    return api.get<PaginatedResponse<AuctionWatchlistEntry>>(endpoints.watchlist.list, {
      auth: true,
      params,
    });
  },

  addToWatchlist(id: string | number) {
    return api.post(endpoints.auctions.watchlist(id), { auth: true });
  },

  removeFromWatchlist(id: string | number) {
    return api.delete(endpoints.auctions.watchlist(id), { auth: true });
  },

  submitClient(id: string | number) {
    return api.post<AuctionDetail>(endpoints.auctions.submit(id), { auth: true });
  },

  cancelClient(id: string | number, reason?: string) {
    return api.post<AuctionDetail>(endpoints.auctions.cancel(id), {
      auth: true,
      body: reason ? { reason } : {},
    });
  },

  createClient(body: AuctionWritePayload) {
    return api.post<AuctionDetail>(endpoints.auctions.list, { body, auth: true });
  },

  patchClient(id: string | number, body: Partial<AuctionWritePayload>) {
    return api.patch<AuctionDetail>(endpoints.auctions.detail(id), {
      body,
      auth: true,
    });
  },

  uploadMediaClient(
    id: string | number,
    file: File,
    options?: { media_type?: string; sort_order?: number; is_blurred?: boolean }
  ) {
    const form = new FormData();
    form.append("file", file);
    form.append("media_type", options?.media_type ?? "image");
    form.append("sort_order", String(options?.sort_order ?? 0));
    form.append("is_blurred", options?.is_blurred ? "true" : "false");
    return api.postForm<AuctionMedia>(endpoints.auctions.media(id), {
      body: form,
      auth: true,
    });
  },

  deleteMediaClient(id: string | number, mediaId: string | number) {
    return api.delete<void>(endpoints.auctions.mediaItem(id, mediaId), {
      auth: true,
    });
  },
};
