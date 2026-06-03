"use client";

import { useEffect } from "react";

import { routes } from "@/config/routes";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useAuth } from "@mazad/auth";
import { Skeleton } from "@mazad/ui";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(
        `${routes.login}?next=${encodeURIComponent(pathname)}`
      );
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
