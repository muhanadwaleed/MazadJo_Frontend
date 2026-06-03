"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Skeleton } from "@mazad/ui";
import { useAuth } from "./use-auth";

type AuthGuardProps = {
  children: React.ReactNode;
  loginPath?: string;
  nextPath?: string;
};

export function AuthGuard({
  children,
  loginPath = "/login",
  nextPath,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const next = nextPath ?? window.location.pathname;
      router.replace(`${loginPath}?next=${encodeURIComponent(next)}`);
    }
  }, [isAuthenticated, isLoading, loginPath, nextPath, router]);

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
