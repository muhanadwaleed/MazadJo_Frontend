export type TokenPair = {
  access: string;
  refresh: string;
};

const ACCESS_KEY = "mazadjo.access";
const REFRESH_KEY = "mazadjo.refresh";

function canUseSessionStorage(): boolean {
  return typeof window !== "undefined" && typeof sessionStorage !== "undefined";
}

export function getAccessToken(): string | null {
  if (!canUseSessionStorage()) return null;
  return sessionStorage.getItem(ACCESS_KEY);
}

export function getRefreshToken(): string | null {
  if (!canUseSessionStorage()) return null;
  return sessionStorage.getItem(REFRESH_KEY);
}

export function setTokens(tokens: TokenPair): void {
  if (!canUseSessionStorage()) return;
  sessionStorage.setItem(ACCESS_KEY, tokens.access);
  sessionStorage.setItem(REFRESH_KEY, tokens.refresh);
}

export function clearTokens(): void {
  if (!canUseSessionStorage()) return;
  sessionStorage.removeItem(ACCESS_KEY);
  sessionStorage.removeItem(REFRESH_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken());
}
