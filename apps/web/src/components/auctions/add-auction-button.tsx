"use client";

import type { VariantProps } from "class-variance-authority";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

import { routes } from "@/config/routes";
import { useAuth } from "@mazad/auth";
import { buttonVariants } from "@mazad/ui";
import { ButtonLink } from "@/components/ui/button-link";
import { cn } from "@mazad/ui/utils";

export function useAddAuctionHref() {
  const { isAuthenticated } = useAuth();
  return isAuthenticated
    ? routes.listingNew
    : `${routes.login}?next=${encodeURIComponent(routes.listingNew)}`;
}

type AddAuctionButtonProps = VariantProps<typeof buttonVariants> & {
  className?: string;
  showIcon?: boolean;
};

export function AddAuctionButton({
  className,
  variant = "default",
  size,
  showIcon = true,
}: AddAuctionButtonProps) {
  const t = useTranslations("nav");
  const href = useAddAuctionHref();

  return (
    <ButtonLink
      href={href}
      variant={variant}
      size={size}
      className={cn(showIcon && "gap-2", className)}
    >
      {showIcon ? <Plus className="size-4" aria-hidden /> : null}
      {t("addAuction")}
    </ButtonLink>
  );
}
