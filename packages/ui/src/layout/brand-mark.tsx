import { cn } from "../utils";

type BrandMarkProps = {
  label?: string;
  variant?: "default" | "light";
  compact?: boolean;
  className?: string;
};

export function BrandMark({
  label = "MazadJo",
  variant = "default",
  compact = false,
  className,
}: BrandMarkProps) {
  const isLight = variant === "light";

  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <img
        src="/logo.png"
        alt="MazadJo Logo"
        className={cn(
          "shrink-0 rounded-lg object-contain shadow-sm",
          compact ? "size-8" : "size-9",
          isLight && "ring-1 ring-white/10"
        )}
      />
      {!compact ? (
        <span
          className={cn(
            "text-lg font-bold tracking-tight",
            isLight ? "text-white" : "text-navy"
          )}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
