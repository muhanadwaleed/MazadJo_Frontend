export type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[] | string> | null;
    request_id?: string;
  };
};

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export type CursorPaginatedResponse<T> = {
  next: string | null;
  previous: string | null;
  results: T[];
};

export type ListParams = {
  page?: number;
  page_size?: number;
  [key: string]: string | number | boolean | undefined;
};
