"use client";

import { useTranslations } from "next-intl";

import { Input } from "@mazad/ui";
import { Label } from "@mazad/ui";
import { JORDAN_COUNTRY_CODE } from "@/lib/validation/auth";
import { cn } from "@mazad/ui/utils";

type JordanPhoneInputProps = {
  id?: string;
  name?: string;
  value: string;
  onChange: (digits: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  onBlur?: () => void;
  compact?: boolean;
  suffix?: React.ReactNode;
};

export function JordanPhoneInput({
  id = "phone_number",
  name = "phone_number",
  value,
  onChange,
  error,
  required,
  disabled,
  onBlur,
  compact = false,
  suffix,
}: JordanPhoneInputProps) {
  const t = useTranslations("auth");

  return (
    <div className={compact ? "space-y-1.5" : "space-y-2"}>
      <Label htmlFor={id}>{t("phoneNumber")}</Label>

      {/* Phone digits always LTR (flag left, +962, number) even on Arabic pages */}
      <div dir="ltr" className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1">
          <div
            className={cn(
              "flex h-12 shrink-0 items-center gap-2 rounded-l-xl border border-r-0 border-input bg-muted px-3",
              error && "border-destructive"
            )}
          >
            <span className="text-lg leading-none" title={t("jordanFlag")} aria-hidden>
              🇯🇴
            </span>
            <span className="text-sm font-medium tabular-nums text-foreground">
              {JORDAN_COUNTRY_CODE}
            </span>
          </div>
          <Input
            id={id}
            name={name}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            dir="ltr"
            lang="en"
            placeholder={t("phonePlaceholder")}
            className={cn(
              "h-12 min-w-0 flex-1 rounded-l-none rounded-r-xl text-left tabular-nums",
              error && "border-destructive"
            )}
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\D/g, "").slice(0, 9))}
            onBlur={onBlur}
            required={required}
            disabled={disabled}
            maxLength={9}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${id}-error` : undefined}
          />
        </div>
        {suffix ? <div className="shrink-0 sm:pt-0">{suffix}</div> : null}
      </div>

      <input type="hidden" name="country_code" value={JORDAN_COUNTRY_CODE} />
      {error ? (
        <p id={`${id}-error`} className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : compact ? null : (
        <p className="text-xs text-muted-foreground">{t("phoneHint")}</p>
      )}
    </div>
  );
}
