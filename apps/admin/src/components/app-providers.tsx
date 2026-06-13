"use client";

import { AuthProvider } from "@mazad/auth";
import { Toaster } from "@mazad/ui";

import { routes } from "@/config/routes";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider loginPath={routes.login}>
      {children}
      <Toaster />
    </AuthProvider>
  );
}
