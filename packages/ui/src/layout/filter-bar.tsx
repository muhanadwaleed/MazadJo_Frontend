import { cn } from "../utils";

export type FilterBarProps = {
  children: React.ReactNode;
  className?: string;
};

/** Admin listing pages — consistent filter row above tables/cards */
export function FilterBar({ children, className }: FilterBarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border border-separator bg-card p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center",
        className
      )}
    >
      {children}
    </div>
  );
}
