"use client";

import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { routes } from "@/config/routes";
import { ApiError } from "@mazad/api";
import { getApiErrorMessage } from "@mazad/api";
import { authService } from "@mazad/api";
import { useAuth } from "@mazad/auth";
import { FieldError } from "@/components/auth/field-error";
import { JordanPhoneInput } from "@/components/auth/jordan-phone-input";
import {
  OtpVerifyDialog,
  type OtpDestination,
} from "@/components/auth/otp-verify-dialog";
import { PasswordStrengthBar } from "@/components/auth/password-strength-bar";
import { SendOtpButton } from "@/components/auth/send-otp-button";
import { PasswordInput } from "@/components/auth/password-input";
import { Button } from "@mazad/ui";
import { Input } from "@mazad/ui";
import { Label } from "@mazad/ui";
import {
  Card,
  CardContent,
  CardFooter,
} from "@mazad/ui";
import {
  isValidEmail,
  isValidJordanPhone,
  normalizeEmail,
  normalizeJordanPhone,
  passwordsMatch,
} from "@/lib/validation/auth";
import { cn } from "@mazad/ui/utils";

export function RegisterForm() {
  const t = useTranslations("auth");
  const router = useRouter();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpDestination, setOtpDestination] = useState<OtpDestination | null>(null);
  const [sendingOtpFor, setSendingOtpFor] = useState<"phone" | "email" | null>(null);

  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirm: false,
    phone: false,
  });

  const emailError = useMemo(() => {
    if (!email.trim()) return undefined;
    if (!touched.email) return undefined;
    if (!isValidEmail(email)) return t("emailInvalid");
    return undefined;
  }, [email, touched.email, t]);

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

  const phoneError = useMemo(() => {
    if (!touched.phone && !phone) return undefined;
    if (!phone) return t("phoneRequired");
    if (!isValidJordanPhone(phone)) return t("phoneInvalid");
    return undefined;
  }, [phone, touched.phone, t]);

  const canSendEmailOtp = Boolean(email.trim() && isValidEmail(email) && !emailError);
  const canSendPhoneOtp = Boolean(phone && isValidJordanPhone(phone) && !phoneError);

  const hasEmail = Boolean(email.trim());
  const emailOtpOk = !hasEmail || emailVerified;

  const canSubmit =
    !emailError &&
    !passwordError &&
    !confirmError &&
    !phoneError &&
    password &&
    confirmPassword &&
    phone &&
    phoneVerified &&
    emailOtpOk;

  function handleEmailChange(value: string) {
    setEmail(value);
    setEmailVerified(false);
    if (value.trim()) {
      setTouched((prev) => ({ ...prev, email: true }));
    }
  }

  function handlePhoneChange(value: string) {
    setPhone(value);
    setPhoneVerified(false);
    if (value) {
      setTouched((prev) => ({ ...prev, phone: true }));
    }
  }

  async function openOtpDialog(destination: OtpDestination) {
    setSendingOtpFor(destination.type);
    try {
      await authService.requestOtp({
        destination_type: destination.type,
        destination_value: destination.value,
      });
      setOtpDestination(destination);
      setOtpDialogOpen(true);
      toast.success(t("otpSent"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("otpSendFailed")
      );
    } finally {
      setSendingOtpFor(null);
    }
  }

  function handleSendPhoneOtp() {
    if (!canSendPhoneOtp) {
      setTouched((prev) => ({ ...prev, phone: true }));
      toast.error(t("enterValidPhoneFirst"));
      return;
    }
    void openOtpDialog({
      type: "phone",
      value: normalizeJordanPhone(phone),
      label: t("destinationPhone"),
    });
  }

  function handleSendEmailOtp() {
    if (!canSendEmailOtp) {
      setTouched((prev) => ({ ...prev, email: true }));
      toast.error(t("enterValidEmailFirst"));
      return;
    }
    void openOtpDialog({
      type: "email",
      value: normalizeEmail(email),
      label: t("destinationEmail"),
    });
  }

  function handleOtpVerified(destination: OtpDestination) {
    if (destination.type === "phone") setPhoneVerified(true);
    if (destination.type === "email") setEmailVerified(true);
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setTouched({ email: true, password: true, confirm: true, phone: true });

    if (!phoneVerified) {
      toast.error(t("verifyPhoneFirst"));
      return;
    }
    if (hasEmail && !emailVerified) {
      toast.error(t("verifyEmailFirst"));
      return;
    }

    if (!canSubmit) {
      toast.error(t("fixFormErrors"));
      return;
    }

    const form = new FormData(event.currentTarget);
    const username = String(form.get("username")).trim();
    const full_name_en = String(form.get("full_name_en") || "").trim();

    if (!username) {
      toast.error(t("usernameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.register({
        username,
        password,
        email: hasEmail ? normalizeEmail(email) : undefined,
        full_name_en: full_name_en || undefined,
        phone_number: normalizeJordanPhone(phone),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(getApiErrorMessage(error));
      } else if (error instanceof Error) {
        toast.error(error.message || t("registrationFailed"));
      } else {
        toast.error(t("registrationFailedApi"));
      }
      setIsSubmitting(false);
      return;
    }

    try {
      await login({ username, password });
      toast.success(t("accountCreatedWelcome"));
      router.push(routes.auctions);
      router.refresh();
    } catch (error) {
      if (error instanceof ApiError) {
        toast.error(
          t("accountCreatedSignInFailed", { message: getApiErrorMessage(error) })
        );
      } else if (error instanceof Error) {
        toast.error(
          t("accountCreatedSignInFailed", { message: error.message })
        );
      } else {
        toast.error(t("accountCreatedPleaseSignIn"));
      }
      router.push(routes.login);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Card className="border-mazad-primary/15 shadow-sm">
        <form onSubmit={onSubmit} noValidate>
          <CardContent className="space-y-4 pt-6">
            <p className="text-sm text-muted-foreground">{t("registerFormHint")}</p>

            <div className="space-y-2">
              <Label htmlFor="username">{t("username")}</Label>
              <Input id="username" name="username" required autoComplete="username" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_name_en">{t("fullNameOptional")}</Label>
              <Input id="full_name_en" name="full_name_en" autoComplete="name" />
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t("emailOptional")}</Label>
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
                      aria-invalid={Boolean(emailError)}
                      className={cn(emailError && "border-destructive")}
                    />
                    {emailError ? <FieldError message={emailError} /> : null}
                  </div>
                  {hasEmail ? (
                    <SendOtpButton
                      verified={emailVerified}
                      loading={sendingOtpFor === "email"}
                      onClick={handleSendEmailOtp}
                    />
                  ) : null}
                </div>
              </div>

              <JordanPhoneInput
                value={phone}
                onChange={handlePhoneChange}
                onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                error={phoneError}
                required
                disabled={isSubmitting}
                suffix={
                  <SendOtpButton
                    verified={phoneVerified}
                    loading={sendingOtpFor === "phone"}
                    onClick={handleSendPhoneOtp}
                  />
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("password")}</Label>
              <PasswordInput
                id="password"
                name="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setTouched((prev) => ({ ...prev, password: true }));
                }}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={Boolean(passwordError)}
                className={cn(passwordError && "border-destructive")}
                required
                minLength={8}
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
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setTouched((prev) => ({ ...prev, confirm: true }));
                }}
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
              />
              {touched.confirm && passwordsMatch(password, confirmPassword) && !confirmError ? (
                <p className="text-sm text-green-700">{t("passwordsMatch")}</p>
              ) : (
                <FieldError message={confirmError} />
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              className="w-full bg-mazad-accent hover:bg-accent-dark"
              disabled={isSubmitting}
            >
              {isSubmitting ? t("registering") : t("registerButton")}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link href={routes.login} className="underline hover:text-foreground">
                {t("signInTitle")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>

      <OtpVerifyDialog
        open={otpDialogOpen}
        onOpenChange={setOtpDialogOpen}
        destination={otpDestination}
        onVerified={handleOtpVerified}
      />
    </>
  );
}
