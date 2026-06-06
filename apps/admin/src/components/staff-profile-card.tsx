"use client";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import type { UserProfile } from "@mazad/api";
import { usersService } from "@mazad/api";
import { useAuth } from "@mazad/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Badge,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@mazad/ui";

function displayName(
  profile: Pick<UserProfile, "full_name_en" | "full_name_ar" | "username">,
  locale: string
) {
  if (locale === "ar") {
    return profile.full_name_ar || profile.full_name_en || profile.username;
  }
  return profile.full_name_en || profile.full_name_ar || profile.username;
}

function formatDateTime(iso: string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-JO" : "en-JO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function StaffProfileCard() {
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

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="size-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error || !user) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-sm text-muted-foreground">
          {error ?? t("unavailable")}
        </CardContent>
      </Card>
    );
  }

  const name = displayName(user, locale);
  const userTypeKey = user.user_type as "public_user" | "staff" | "admin";
  const userTypeLabel = t.has(`userType.${userTypeKey}`)
    ? t(`userType.${userTypeKey}`)
    : user.user_type;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="size-12">
          {user.profile_image ? (
            <AvatarImage src={user.profile_image} alt={name} />
          ) : null}
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getInitials(name || user.username)}
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
  );
}
