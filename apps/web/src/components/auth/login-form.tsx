"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { ApiError, isAccountDisabledError } from "@mazad/api";
import { getApiErrorMessage } from "@mazad/api";
import { useAuth, sanitizeInternalPath } from "@mazad/auth";
import {
  Button,
  Card,
  CardContent,
  CardFooter,
  Input,
  Label,
  primaryButtonClassName,
} from "@mazad/ui";
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
      toast.error(t("credentialsRequired"));
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
    <Card className="border-mazad-primary/15 shadow-sm">
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4 pt-6">
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
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className={`w-full ${primaryButtonClassName}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("signingIn") : t("signInTitle")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href={routes.forgotPassword} className="underline hover:text-foreground">
              {t("forgotPassword")}
            </Link>
            {" · "}
            <Link href={routes.register} className="underline hover:text-foreground">
              {t("createAccount")}
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
