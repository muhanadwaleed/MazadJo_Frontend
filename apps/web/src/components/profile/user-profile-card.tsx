"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { displayName, formatDateTime } from "@/lib/format";
import type { UserProfile } from "@mazad/api";
import { useAuth } from "@mazad/auth";
import { usersService } from "@mazad/api";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";
import { ErrorState } from "@/components/common/error-state";
import { LoadingGrid } from "@/components/common/loading-grid";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mazad/ui";
import { Badge } from "@mazad/ui";
import { Avatar, AvatarFallback } from "@mazad/ui";

export function UserProfileCard() {
  const t = useTranslations("profile");
  const locale = useLocale();
  const { user: cached } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(cached);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    void usersService
      .me()
      .then(setUser)
      .catch(() => setError(t("loadError")))
      .finally(() => setLoading(false));
  }, [t]);

  if (loading) return <LoadingGrid count={1} className="grid-cols-1" />;
  if (error || !user) {
    return <ErrorState message={error ?? t("unavailable")} />;
  }

  const name = displayName(user, locale);
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const userTypeKey = user.user_type as "public_user" | "staff" | "admin";
  const userTypeLabel = t.has(`userType.${userTypeKey}`)
    ? t(`userType.${userTypeKey}`)
    : user.user_type;

  return (
    <div className="space-y-6">
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="size-12">
          <AvatarFallback className="bg-primary text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{name}</CardTitle>
          <CardDescription>@{user.username}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div className="flex flex-wrap gap-2">
          {user.is_phone_verified ? (
            <Badge variant="outline">{t("phoneVerified")}</Badge>
          ) : null}
          {user.is_email_verified ? (
            <Badge variant="outline">{t("emailVerified")}</Badge>
          ) : null}
          <Badge variant="secondary">{userTypeLabel}</Badge>
        </div>
        <p>
          <span className="text-muted-foreground">{t("email")}: </span>
          {user.email || "—"}
        </p>
        <p>
          <span className="text-muted-foreground">{t("phone")}: </span>
          <span dir="ltr" className="inline-block tabular-nums">
            {user.country_code} {user.phone_number || "—"}
          </span>
        </p>
        <p>
          <span className="text-muted-foreground">{t("joined")}: </span>
          {formatDateTime(user.date_joined, locale)}
        </p>
      </CardContent>
    </Card>
    <ProfileEditForm user={user} onUpdated={setUser} />
    </div>
  );
}
