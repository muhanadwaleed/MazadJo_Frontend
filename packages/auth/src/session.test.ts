import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  clearTokens,
  getAccessToken,
  isAuthenticated,
  setTokens,
} from "./session";

function createSessionStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, value);
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
  };
}

describe("session", () => {
  beforeEach(() => {
    const storage = createSessionStorage();
    vi.stubGlobal("window", { sessionStorage: storage });
    vi.stubGlobal("sessionStorage", storage);
  });

  afterEach(() => {
    clearTokens();
    vi.unstubAllGlobals();
  });

  it("tracks authentication from access token presence", () => {
    expect(isAuthenticated()).toBe(false);
    setTokens({ access: "a", refresh: "r" });
    expect(isAuthenticated()).toBe(true);
    expect(getAccessToken()).toBe("a");
    clearTokens();
    expect(isAuthenticated()).toBe(false);
  });
});
