"use client";

import { useTranslations } from "next-intl";
import { AlertCircle } from "lucide-react";

import { cn } from "@mazad/ui/utils";
import { Button } from "@mazad/ui";

export function ErrorState({
  title,
  message,
  onRetry,
  className,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-10 text-center",
        className
      )}
      role="alert"
    >
      <AlertCircle className="mb-3 size-10 text-destructive" aria-hidden />
      <h3 className="text-lg font-medium text-foreground">
        {title ?? t("errors.genericTitle")}
      </h3>
      {message ? (
        <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      ) : null}
      {onRetry ? (
        <Button variant="outline" className="mt-6" onClick={onRetry}>
          {t("common.tryAgain")}
        </Button>
      ) : null}
    </div>
  );
}
