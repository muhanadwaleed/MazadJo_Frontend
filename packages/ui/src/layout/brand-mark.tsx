import { cn } from "../utils";

export function BrandMark({
  label = "MazadJo",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-mazad-primary to-navy text-sm font-bold text-primary-foreground shadow-sm">
        M
      </span>
      <span className="text-lg font-semibold tracking-tight text-navy">{label}</span>
    </span>
  );
}
