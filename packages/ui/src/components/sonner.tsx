"use client";

import { useTheme } from "next-themes";
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  CheckCircle2Icon,
  InfoIcon,
  Loader2Icon,
  XIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="mazad-toaster group"
      position="top-center"
      offset={16}
      mobileOffset={{ top: 12, left: 12, right: 12 }}
      gap={10}
      duration={4000}
      visibleToasts={4}
      closeButton
      icons={{
        success: (
          <CheckCircle2Icon className="size-[1.125rem] shrink-0 text-[var(--mazad-success)]" />
        ),
        info: (
          <InfoIcon className="size-[1.125rem] shrink-0 text-mazad-primary" />
        ),
        warning: (
          <AlertTriangleIcon className="size-[1.125rem] shrink-0 text-mazad-accent" />
        ),
        error: (
          <AlertCircleIcon className="size-[1.125rem] shrink-0 text-[var(--mazad-error)]" />
        ),
        loading: (
          <Loader2Icon className="size-[1.125rem] shrink-0 animate-spin text-mazad-primary" />
        ),
        close: (
          <XIcon
            className="size-2.5 shrink-0 opacity-80"
            strokeWidth={2.25}
            aria-hidden
          />
        ),
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: "mazad-toast",
          title: "mazad-toast-title",
          description: "mazad-toast-description",
          content: "mazad-toast-content",
          icon: "mazad-toast-icon",
          closeButton: "mazad-toast-close",
          actionButton: "mazad-toast-action",
          cancelButton: "mazad-toast-cancel",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
