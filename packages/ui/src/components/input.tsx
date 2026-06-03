import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "../utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-12 w-full min-w-0 rounded-xl border border-input bg-card px-3.5 py-2 text-base shadow-sm transition-[border-color,box-shadow] duration-200 outline-none file:inline-flex file:h-8 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground hover:border-mazad-primary/25 focus-visible:border-mazad-light-blue focus-visible:ring-[3px] focus-visible:ring-mazad-light-blue/25 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-mazad-error aria-invalid:ring-[3px] aria-invalid:ring-mazad-error/20 md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
