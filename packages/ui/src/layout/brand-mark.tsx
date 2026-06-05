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
      <img
        src="/logo.png"
        alt="MazadJo Logo"
        className="size-9 object-contain rounded-lg shadow-sm"
      />
      <span className="hidden size-9 items-center justify-center rounded-lg bg-gradient-to-br from-mazad-primary to-navy text-sm font-bold text-primary-foreground shadow-sm">
        M
      </span>
      <span className="text-lg font-semibold tracking-tight text-navy">{label}</span>
    </span>
  );
}
