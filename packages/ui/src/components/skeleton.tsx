import { cn } from "../utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "rounded-xl bg-gradient-to-r from-muted via-muted/60 to-muted bg-[length:200%_100%] animate-[mazad-shimmer_2.5s_ease-in-out_infinite]",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
