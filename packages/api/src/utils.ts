import type { PaginatedResponse } from "./types";

/** DRF may return a bare array or paginated `{ results }` depending on view config. */
export function asList<T>(data: PaginatedResponse<T> | T[]): T[] {
  return Array.isArray(data) ? data : data.results;
}
