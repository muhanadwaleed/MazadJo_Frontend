"use client";

import { routes } from "@/config/routes";
import { AuthProvider } from "@mazad/auth";
import { Toaster } from "@mazad/ui";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider loginPath={routes.login}>
      {children}
      <Toaster richColors position="top-center" />
    </AuthProvider>
  );
}
