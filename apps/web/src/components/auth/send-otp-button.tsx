"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

import { Button } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type SendOtpButtonProps = {
  verified: boolean;
  loading?: boolean;
  onClick: () => void;
  className?: string;
};

export function SendOtpButton({
  verified,
  loading,
  onClick,
  className,
}: SendOtpButtonProps) {
  const t = useTranslations("auth");

  if (verified) {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled
        className={cn("h-12 shrink-0 border-green-600 text-green-700 sm:h-9", className)}
      >
        <Check className="size-4" aria-hidden />
        {t("verified")}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className={cn("h-12 shrink-0 sm:h-9", className)}
      disabled={loading}
      onClick={onClick}
    >
      {loading ? t("sending") : t("sendOtp")}
    </Button>
  );
}
