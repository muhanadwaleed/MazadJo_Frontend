"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@mazad/ui";
import { withLocalePrefix } from "./locale-path";
import { useAuth } from "./use-auth";

type StaffGuardProps = {
  children: React.ReactNode;
  loginPath?: string;
};

export function StaffGuard({ children, loginPath = "/login" }: StaffGuardProps) {
  const { user, isAuthenticated, isLoading, clearSession } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(
        `${withLocalePrefix(loginPath)}?next=${encodeURIComponent(window.location.pathname)}`
      );
      return;
    }

    if (user && !user.is_staff) {
      clearSession();
      router.replace(`${withLocalePrefix(loginPath)}?error=staff_required`);
    }
  }, [clearSession, isAuthenticated, isLoading, loginPath, router, user]);

  if (isLoading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated || !user?.is_staff) {
    return null;
  }

  return <>{children}</>;
}
