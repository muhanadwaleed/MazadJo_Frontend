import type { ApiError } from "@mazad/api";

export function apiFieldErrors(error: ApiError): Record<string, string> {
  const out: Record<string, string> = {};
  const details = error.details;
  if (!details || typeof details !== "object") return out;

  for (const [field, value] of Object.entries(details)) {
    if (Array.isArray(value)) {
      out[field] = value.join(" ");
    } else if (typeof value === "string") {
      out[field] = value;
    }
  }
  return out;
}
