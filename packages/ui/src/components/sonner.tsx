"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
  Loader2Icon,
} from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      position="bottom-right"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-mazad-primary" />,
        info: <InfoIcon className="size-4 text-mazad-primary" />,
        warning: <TriangleAlertIcon className="size-4 text-mazad-accent" />,
        error: <OctagonXIcon className="size-4 text-mazad-accent" />,
        loading: <Loader2Icon className="size-4 animate-spin text-mazad-primary" />,
      }}
      toastOptions={{
        classNames: {
          toast: "cn-toast !rounded-[14px]",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
