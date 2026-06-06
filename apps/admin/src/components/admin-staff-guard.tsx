"use client";

import { useEffect } from "react";

import { routes } from "@/config/routes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@mazad/auth";
import { Skeleton } from "@mazad/ui";

export function AdminStaffGuard({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, clearSession } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`${routes.login}?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (user && !user.is_staff) {
      clearSession();
      router.replace(`${routes.login}?error=staff_required`);
    }
  }, [clearSession, isAuthenticated, isLoading, pathname, router, user]);

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
