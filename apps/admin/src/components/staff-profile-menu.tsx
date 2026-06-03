"use client";

import { useLocale, useTranslations } from "next-intl";
import { LogOut, UserRound } from "lucide-react";

import { useAuth } from "@mazad/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mazad/ui";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function StaffProfileMenu() {
  const t = useTranslations("staff");
  const locale = useLocale();
  const { user, logout } = useAuth();

  if (!user) return null;

  const displayName =
    (locale === "ar" ? user.full_name_ar : user.full_name_en) ||
    user.full_name_en ||
    user.username;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <Button
            variant="ghost"
            size="sm"
            className="h-9 gap-2 rounded-full px-2 hover:bg-light-blue/10"
            aria-label={t("profileMenu")}
          />
        }
      >
        <Avatar size="sm">
          {user.profile_image ? (
            <AvatarImage src={user.profile_image} alt={displayName} />
          ) : null}
          <AvatarFallback>{getInitials(displayName || user.username)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-navy sm:inline">
          {displayName}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex items-center gap-3">
            <Avatar>
              {user.profile_image ? (
                <AvatarImage src={user.profile_image} alt={displayName} />
              ) : null}
              <AvatarFallback>{getInitials(displayName || user.username)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-semibold text-navy">{displayName}</p>
              <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
              {user.email ? (
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
              ) : null}
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
          <UserRound className="size-4" />
          {user.user_type}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut className="size-4" />
          {t("signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
