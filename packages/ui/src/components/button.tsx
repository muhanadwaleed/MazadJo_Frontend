import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2Icon } from "lucide-react"

import { cn } from "../utils"

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-out outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-mazad-error aria-invalid:ring-mazad-error/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "bg-mazad-accent text-white shadow-sm hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md active:scale-[0.98]",
        primary:
          "bg-mazad-accent text-white shadow-sm hover:-translate-y-0.5 hover:bg-accent-dark hover:shadow-md active:scale-[0.98]",
        secondary:
          "border-mazad-primary/25 bg-card text-mazad-primary shadow-sm hover:bg-light-blue/10 active:scale-[0.98]",
        outline:
          "border-mazad-primary/30 bg-card text-mazad-primary shadow-sm hover:bg-light-blue/8 active:scale-[0.98]",
        heroPrimary:
          "bg-white text-navy shadow-md hover:bg-white/90 active:scale-[0.98]",
        heroOutline:
          "border-white/30 bg-transparent text-white shadow-sm hover:bg-white/10 hover:text-white backdrop-blur-sm active:scale-[0.98]",
        ghost:
          "text-navy hover:bg-muted active:scale-[0.98]",
        destructive:
          "bg-mazad-error/10 text-mazad-error hover:bg-mazad-error/15 focus-visible:ring-mazad-error/25",
        link: "text-mazad-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4",
        xs: "h-8 rounded-lg px-2.5 text-xs",
        sm: "h-9 rounded-lg px-3 text-[0.8125rem]",
        lg: "h-12 px-5 text-base",
        icon: "size-11",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  loading = false,
  disabled,
  children,
  ...props
}: ButtonPrimitive.Props &
  VariantProps<typeof buttonVariants> & {
    loading?: boolean
  }) {
  return (
    <ButtonPrimitive
      data-slot="button"
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      {loading ? (
        <Loader2Icon className="size-4 animate-spin" aria-hidden />
      ) : null}
      {children}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
