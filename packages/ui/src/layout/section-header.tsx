import { cn } from "../utils";

export type SectionHeaderProps = {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  action,
  badge,
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-2.5">
          {badge}
          <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
            {title}
          </h2>
        </div>
        {description ? (
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
