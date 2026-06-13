"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { notify, toast, Button, Input, Label, primaryButtonClassName } from "@mazad/ui";
import { routes } from "@/config/routes";
import { ApiError, isAccountDisabledError, getApiErrorMessage } from "@mazad/api";
import { useAuth, sanitizeInternalPath } from "@mazad/auth";
import { PasswordInput } from "@/components/auth/password-input";

export function LoginForm() {
  const t = useTranslations("auth");
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = sanitizeInternalPath(searchParams.get("next"), routes.auctions);
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
      toast.success(t("signedIn"));
      router.push(next);
      router.refresh();
    } catch (error) {
      if (isAccountDisabledError(error)) {
        toast.error(t("accountDisabled"));
      } else if (error instanceof ApiError) {
        const message = getApiErrorMessage(error);
        if (error.status === 401) {
          toast.error(t("invalidCredentials"));
        } else {
          toast.error(message);
        }
      } else {
        toast.error(t("serverUnreachable"));
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-4">
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
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            disabled={isSubmitting}
          />
        </div>
      </div>
      <div className="space-y-4">
        <Button
          type="submit"
          className={`w-full cursor-pointer ${primaryButtonClassName}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? t("signingIn") : t("signInTitle")}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href={routes.forgotPassword}
            className="cursor-pointer font-medium text-mazad-primary transition-opacity duration-200 hover:opacity-85"
          >
            {t("forgotPassword")}
          </Link>
        </p>
      </div>
    </form>
  );
}
