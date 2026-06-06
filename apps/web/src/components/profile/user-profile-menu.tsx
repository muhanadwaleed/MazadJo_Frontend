"use client";

import { LogOut, UserRound } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { displayName } from "@/lib/format";
import { useAuth } from "@mazad/auth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  buttonVariants,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export function UserProfileMenu() {
  const t = useTranslations();
  const locale = useLocale();
  const { user, logout } = useAuth();

  if (!user) return null;

  const name = displayName(user, locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton
        className={cn(
          buttonVariants({ variant: "ghost", size: "sm" }),
          "h-9 cursor-pointer gap-2 rounded-full px-2 hover:bg-light-blue/10"
        )}
        aria-label={t("nav.profileMenu")}
      >
        <Avatar size="sm">
          {user.profile_image ? (
            <AvatarImage src={user.profile_image} alt={name} />
          ) : null}
          <AvatarFallback>{getInitials(name || user.username)}</AvatarFallback>
        </Avatar>
        <span className="hidden max-w-[120px] truncate text-sm font-medium text-navy sm:inline">
          {user.username}
        </span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-2">
          <div className="flex items-center gap-3">
            <Avatar>
              {user.profile_image ? (
                <AvatarImage src={user.profile_image} alt={name} />
              ) : null}
              <AvatarFallback>{getInitials(name || user.username)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 space-y-0.5">
              <p className="truncate text-sm font-semibold text-navy">{name}</p>
              <p className="truncate text-xs text-muted-foreground">@{user.username}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem render={<Link href={routes.profile} className="cursor-pointer" />}>
          <UserRound className="size-4" />
          {t("nav.profile")}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={logout}>
          <LogOut className="size-4" />
          {t("nav.signOut")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
