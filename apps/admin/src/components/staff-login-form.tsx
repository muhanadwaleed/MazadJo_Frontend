"use client";

import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import {
  ApiError,
  getApiErrorMessage,
  isAccountDisabledError,
  usersService,
} from "@mazad/api";
import { useAuth, sanitizeInternalPath } from "@mazad/auth";
import {
  notify,
  toast,
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Label,
  primaryButtonClassName,
} from "@mazad/ui";

import { routes } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";

export function StaffLoginForm() {
  const t = useTranslations("login");
  const { login, clearSession } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeInternalPath(searchParams.get("next"), routes.home);
  const staffError = searchParams.get("error") === "staff_required";
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username")).trim();
    const password = String(form.get("password"));

    if (!username || !password) {
      notify.validation(t("credentialsRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await login({ username, password });
      const profile = await usersService.me();

      if (!profile.is_staff) {
        clearSession();
        toast.error(t("staffOnly"));
        return;
      }

      toast.success(t("signedIn"));
      router.push(next);
      router.refresh();
    } catch (error) {
      if (isAccountDisabledError(error)) {
        toast.error(t("accountDisabled"));
      } else if (error instanceof ApiError) {
        toast.error(
          error.status === 401 ? t("invalidCredentials") : getApiErrorMessage(error)
        );
      } else {
        toast.error(t("serverUnreachable"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="border-mazad-primary/15 shadow-sm">
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4 pt-6">
          {staffError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {t("staffRequired")}
            </p>
          ) : null}
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              name="username"
              required
              autoComplete="username"
              disabled={isSubmitting}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              disabled={isSubmitting}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className={`w-full ${primaryButtonClassName}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("signingIn") : t("signIn")}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
