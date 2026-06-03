import type { ApiErrorEnvelope } from "./types";

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: ApiErrorEnvelope["error"]["details"];
  readonly requestId?: string;

  constructor(status: number, body: ApiErrorEnvelope | null, fallbackMessage?: string) {
    const code = body?.error?.code ?? "unknown_error";
    const message =
      body?.error?.message ?? fallbackMessage ?? `Request failed (${status})`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = body?.error?.details;
    this.requestId = body?.error?.request_id;
  }
}

function flattenDetails(
  details: ApiErrorEnvelope["error"]["details"]
): string | null {
  if (!details || typeof details !== "object") return null;

  const parts: string[] = [];
  for (const [field, value] of Object.entries(details)) {
    if (Array.isArray(value)) {
      parts.push(`${field}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      parts.push(`${field}: ${value}`);
    } else if (value && typeof value === "object") {
      parts.push(`${field}: ${JSON.stringify(value)}`);
    }
  }
  return parts.length > 0 ? parts.join(" · ") : null;
}

export function getApiErrorMessage(error: ApiError): string {
  return flattenDetails(error.details) ?? error.message;
}

export async function parseApiError(response: Response): Promise<ApiError> {
  let body: ApiErrorEnvelope | null = null;
  try {
    const json = (await response.json()) as ApiErrorEnvelope | Record<string, unknown>;
    if (json && typeof json === "object" && "error" in json) {
      body = json as ApiErrorEnvelope;
    } else if (json && typeof json === "object") {
      body = {
        error: {
          code: "validation_error",
          message: "Validation failed",
          details: json as Record<string, string[] | string>,
        },
      };
    }
  } catch {
    body = null;
  }
  return new ApiError(response.status, body, response.statusText);
}
