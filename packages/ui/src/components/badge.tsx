import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../utils"

const badgeVariants = cva(
  "inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 rounded-full border border-transparent px-2.5 text-xs font-semibold whitespace-nowrap transition-colors [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-mazad-primary text-white",
        secondary: "bg-secondary text-navy",
        destructive: "bg-mazad-error/10 text-mazad-error",
        outline: "border-separator text-navy",
        ghost: "text-muted-foreground",
        link: "text-mazad-primary underline-offset-4",
        /** Auction status badges */
        live: "bg-mazad-accent text-white",
        active: "bg-mazad-primary text-white",
        sold: "bg-muted text-muted-foreground",
        won: "bg-mazad-success text-white",
        draft: "bg-muted/80 text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
