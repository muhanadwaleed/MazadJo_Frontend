"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { ApiError, authService, usersService } from "@mazad/api";
import type { LoginPayload, UserProfile } from "@mazad/api";
import { clearTokens, getAccessToken, isAuthenticated } from "./session";

type AuthContextValue = {
  user: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: React.ReactNode;
  loginPath?: string;
};

export function AuthProvider({
  children,
  loginPath = "/login",
}: AuthProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!getAccessToken()) {
      setUser(null);
      return;
    }
    try {
      const profile = await usersService.me();
      setUser(profile);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearTokens();
      }
      setUser(null);
    }
  }, []);

  useEffect(() => {
    void (async () => {
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  const clearSession = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const login = useCallback(
    async (payload: LoginPayload) => {
      await authService.login(payload);
      const profile = await usersService.me();
      setUser(profile);
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(() => {
    clearSession();
    router.push(loginPath);
    router.refresh();
  }, [clearSession, loginPath, router]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: isAuthenticated(),
      login,
      logout,
      refreshUser,
      clearSession,
    }),
    [user, isLoading, login, logout, refreshUser, clearSession]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
