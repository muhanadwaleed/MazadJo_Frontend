"use client";

import { useTranslations } from "next-intl";

import { getPasswordStrength } from "@/lib/validation/auth";
import { cn } from "@mazad/ui/utils";

const barColors: Record<number, string> = {
  1: "bg-destructive",
  2: "bg-mazad-accent",
  3: "bg-light-blue",
  4: "bg-mazad-primary",
};

export function PasswordStrengthBar({ password }: { password: string }) {
  const t = useTranslations("auth");

  if (!password) return null;

  const { score, percent } = getPasswordStrength(password);
  const labelByScore: Record<number, string> = {
    1: t("strengthWeak"),
    2: t("strengthFair"),
    3: t("strengthGood"),
    4: t("strengthStrong"),
  };
  const label = labelByScore[score] ?? labelByScore[1];

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            barColors[score]
          )}
          style={{ width: `${Math.max(percent, 8)}%` }}
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t("passwordStrength", { label })}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        {t("passwordStrength", { label })}
      </p>
    </div>
  );
}
