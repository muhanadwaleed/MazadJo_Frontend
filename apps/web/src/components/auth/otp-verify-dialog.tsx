"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { ApiError } from "@mazad/api";
import { getApiErrorMessage } from "@mazad/api";
import { authService } from "@mazad/api";
import { Button } from "@mazad/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@mazad/ui";
import { Input } from "@mazad/ui";
import { Label } from "@mazad/ui";

export type OtpDestination = {
  type: "phone" | "email";
  value: string;
  label: string;
};

type OtpVerifyDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  destination: OtpDestination | null;
  onVerified: (destination: OtpDestination) => void;
};

export function OtpVerifyDialog({
  open,
  onOpenChange,
  destination,
  onVerified,
}: OtpVerifyDialogProps) {
  const t = useTranslations("auth");
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (!open) setCode("");
  }, [open]);

  async function handleResend() {
    if (!destination) return;
    setIsResending(true);
    try {
      await authService.requestOtp({
        destination_type: destination.type,
        destination_value: destination.value,
      });
      toast.success(t("otpSentAgain"));
    } catch (error) {
      toast.error(
        error instanceof ApiError ? getApiErrorMessage(error) : t("otpSendFailed")
      );
    } finally {
      setIsResending(false);
    }
  }

  async function handleVerify() {
    if (!destination || !code.trim()) {
      toast.error(t("enterVerificationCode"));
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyOtp({
        destination_type: destination.type,
        destination_value: destination.value,
        code: code.trim(),
      });
      toast.success(t("destinationVerified", { label: destination.label }));
      onVerified(destination);
      onOpenChange(false);
    } catch (error) {
      if (error instanceof ApiError && error.code === "invalid_otp") {
        toast.error(t("invalidOtp"));
      } else {
        toast.error(
          error instanceof ApiError ? getApiErrorMessage(error) : t("verificationFailed")
        );
      }
    } finally {
      setIsVerifying(false);
    }
  }

  const displayValue =
    destination?.type === "phone"
      ? `+962 ${destination.value}`
      : destination?.value;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("otpDialogTitle")}</DialogTitle>
          <DialogDescription>
            {destination ? (
              <>
                {t("otpDialogDescription", { destination: displayValue ?? "" })}
                <span className="mt-2 block text-xs">
                  {t("devOtpHint", { code: "1111" })}
                </span>
              </>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="otp_code">{t("otpCodeLabel")}</Label>
          <Input
            id="otp_code"
            inputMode="numeric"
            autoComplete="one-time-code"
            placeholder={t("otpCodePlaceholder")}
            maxLength={8}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\s/g, ""))}
            disabled={isVerifying}
          />
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          <Button
            type="button"
            className="w-full bg-mazad-accent hover:bg-accent-dark"
            onClick={handleVerify}
            disabled={isVerifying || !code.trim()}
          >
            {isVerifying ? t("verifying") : t("verify")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={handleResend}
            disabled={isResending || !destination}
          >
            {isResending ? t("sending") : t("resendCode")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
