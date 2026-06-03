import { Gavel } from "lucide-react"

import { cn } from "../utils"

export function EmptyState({
  title,
  description,
  action,
  className,
  icon: Icon = Gavel,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
  icon?: React.ComponentType<{ className?: string }>
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-separator bg-card px-8 py-16 text-center shadow-sm",
        className
      )}
    >
      <div className="mb-4 flex size-14 items-center justify-center rounded-2xl bg-surface">
        <Icon className="size-7 text-mazad-primary/70" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold text-navy">{title}</h3>
      {description ? (
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-8">{action}</div> : null}
    </div>
  )
}
