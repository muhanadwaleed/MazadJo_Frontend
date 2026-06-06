import { describe, expect, it } from "vitest";

import { sanitizeInternalPath } from "./safe-redirect";

describe("sanitizeInternalPath", () => {
  const fallback = "/dashboard";

  it("returns fallback when next is empty", () => {
    expect(sanitizeInternalPath(null, fallback)).toBe(fallback);
    expect(sanitizeInternalPath("", fallback)).toBe(fallback);
  });

  it("allows same-app relative paths", () => {
    expect(sanitizeInternalPath("/auctions/review", fallback)).toBe(
      "/auctions/review"
    );
    expect(sanitizeInternalPath("/en/dashboard", fallback)).toBe("/dashboard");
    expect(sanitizeInternalPath("/ar/dashboard", fallback)).toBe("/dashboard");
  });

  it("rejects external and protocol-relative URLs", () => {
    expect(sanitizeInternalPath("https://evil.com", fallback)).toBe(fallback);
    expect(sanitizeInternalPath("//evil.com", fallback)).toBe(fallback);
    expect(sanitizeInternalPath("/\\evil.com", fallback)).toBe(fallback);
  });

  it("rejects paths with schemes", () => {
    expect(sanitizeInternalPath("/foo:bar", fallback)).toBe(fallback);
  });
});
