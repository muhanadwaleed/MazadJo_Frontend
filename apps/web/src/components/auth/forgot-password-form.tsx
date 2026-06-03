"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { ApiError } from "@mazad/api";
import { getApiErrorMessage } from "@mazad/api";
import { authService } from "@mazad/api";
import { FieldError } from "@/components/auth/field-error";
import { JordanPhoneInput } from "@/components/auth/jordan-phone-input";
import { PasswordInput } from "@/components/auth/password-input";
import { PasswordStrengthBar } from "@/components/auth/password-strength-bar";
import { Button } from "@mazad/ui";
import { Input } from "@mazad/ui";
import { Label } from "@mazad/ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@mazad/ui";
import {
  isValidEmail,
  isValidJordanPhone,
  normalizeEmail,
  normalizeJordanPhone,
  passwordsMatch,
} from "@/lib/validation/auth";
import { cn } from "@mazad/ui/utils";

type DestinationType = "email" | "phone";

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const router = useRouter();

  const [step, setStep] = useState<"request" | "confirm">("request");
  const [destinationType, setDestinationType] = useState<DestinationType>("email");
  const [destination, setDestination] = useState({
    type: "email" as DestinationType,
    value: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [touched, setTouched] = useState({
    email: false,
    phone: false,
    password: false,
    confirm: false,
  });

  const emailError = useMemo(() => {
    if (destinationType !== "email") return undefined;
    if (!touched.email && !email) return undefined;
    if (!email.trim()) return t("destinationRequired");
    if (!isValidEmail(email)) return t("emailInvalid");
    return undefined;
  }, [destinationType, email, touched.email, t]);

  const phoneError = useMemo(() => {
    if (destinationType !== "phone") return undefined;
    if (!touched.phone && !phone) return undefined;
    if (!phone) return t("phoneRequired");
    if (!isValidJordanPhone(phone)) return t("phoneInvalid");
    return undefined;
  }, [destinationType, phone, touched.phone, t]);

  const passwordError = useMemo(() => {
    if (!touched.password && !password) return undefined;
    if (password.length < 8) return t("passwordMinLength");
    return undefined;
  }, [password, touched.password, t]);

  const confirmError = useMemo(() => {
    if (!touched.confirm && !confirmPassword) return undefined;
    if (!confirmPassword) return t("confirmPasswordRequired");
    if (!passwordsMatch(password, confirmPassword)) return t("passwordsDoNotMatch");
    return undefined;
  }, [confirmPassword, password, touched.confirm, t]);

  const canRequest =
    destinationType === "email"
      ? Boolean(email.trim() && isValidEmail(email) && !emailError)
      : Boolean(phone && isValidJordanPhone(phone) && !phoneError);

  const canConfirm =
    Boolean(code.trim()) &&
    !passwordError &&
    !confirmError &&
    password.length >= 8 &&
    passwordsMatch(password, confirmPassword);

  function getDestinationValue(): string {
    return destinationType === "email"
      ? normalizeEmail(email)
      : normalizeJordanPhone(phone);
  }

  async function onRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched((prev) => ({
      ...prev,
      email: destinationType === "email",
      phone: destinationType === "phone",
    }));

    if (!canRequest) {
      toast.error(t("fixFormErrors"));
      return;
    }

    const destination_value = getDestinationValue();
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset({
        destination_type: destinationType,
        destination_value,
      });
      setDestination({ type: destinationType, value: destination_value });
      setStep("confirm");
      toast.success(t("resetCodeSent"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("requestFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function onConfirm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched((prev) => ({ ...prev, password: true, confirm: true }));

    if (!canConfirm) {
      toast.error(t("fixFormErrors"));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.confirmPasswordReset({
        destination_type: destination.type,
        destination_value: destination.value,
        code: code.trim(),
        new_password: password,
      });
      toast.success(t("passwordUpdated"));
      router.push(routes.login);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("resetFailed")
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const primaryButtonClass = "w-full bg-mazad-accent hover:bg-accent-dark";

  if (step === "confirm") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("confirmResetTitle")}</CardTitle>
          <CardDescription>{t("confirmResetDescription")}</CardDescription>
        </CardHeader>
        <form onSubmit={onConfirm} noValidate>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("devOtpHint", { code: "1111" })}
            </p>
            <div className="space-y-2">
              <Label htmlFor="code">{t("resetCode")}</Label>
              <Input
                id="code"
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 8))}
                required
                maxLength={8}
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new_password">{t("newPassword")}</Label>
              <PasswordInput
                id="new_password"
                name="new_password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={Boolean(passwordError)}
                className={cn(passwordError && "border-destructive")}
                required
                minLength={8}
                disabled={isSubmitting}
              />
              <PasswordStrengthBar password={password} />
              <FieldError message={passwordError} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">{t("confirmPassword")}</Label>
              <PasswordInput
                id="confirm_password"
                name="confirm_password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirm: true }))}
                aria-invalid={Boolean(confirmError)}
                className={cn(
                  confirmError && "border-destructive",
                  !confirmError &&
                    touched.confirm &&
                    passwordsMatch(password, confirmPassword) &&
                    "border-green-600"
                )}
                required
                disabled={isSubmitting}
              />
              {touched.confirm && passwordsMatch(password, confirmPassword) && !confirmError ? (
                <p className="text-sm text-green-700">{t("passwordsMatch")}</p>
              ) : (
                <FieldError message={confirmError} />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button
              type="submit"
              className={primaryButtonClass}
              disabled={isSubmitting}
            >
              {isSubmitting ? t("updatingPassword") : t("updatePassword")}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isSubmitting}
              onClick={() => setStep("request")}
            >
              {t("back")}
            </Button>
          </CardFooter>
        </form>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("forgotPasswordCardTitle")}</CardTitle>
        <CardDescription>{t("forgotPasswordCardDescription")}</CardDescription>
      </CardHeader>
      <form onSubmit={onRequest} noValidate>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("resetVia")}</Label>
            <div
              className="flex rounded-md border border-border p-0.5"
              role="group"
              aria-label={t("resetVia")}
            >
              {(["email", "phone"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    setDestinationType(type);
                    setTouched({ email: false, phone: false, password: false, confirm: false });
                  }}
                  className={cn(
                    "flex-1 rounded px-3 py-2 text-sm font-medium transition-colors",
                    destinationType === type
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                  aria-pressed={destinationType === type}
                >
                  {type === "email" ? t("destinationEmail") : t("destinationPhone")}
                </button>
              ))}
            </div>
          </div>

          {destinationType === "email" ? (
            <div className="space-y-2">
              <Label htmlFor="email">{t("emailLabel")}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                aria-invalid={Boolean(emailError)}
                className={cn(emailError && "border-destructive")}
                required
                disabled={isSubmitting}
              />
              <FieldError message={emailError} />
            </div>
          ) : (
            <JordanPhoneInput
              value={phone}
              onChange={setPhone}
              onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
              error={phoneError}
              required
              disabled={isSubmitting}
            />
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className={primaryButtonClass}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("sendingResetCode") : t("sendResetCode")}
          </Button>
          <Link
            href={routes.login}
            className="text-center text-sm text-muted-foreground underline hover:text-foreground"
          >
            {t("backToSignIn")}
          </Link>
        </CardFooter>
      </form>
    </Card>
  );
}
