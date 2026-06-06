import { cn } from "../utils";

export type ContentSectionProps = {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ContentSection({
  title,
  description,
  icon,
  children,
  className,
}: ContentSectionProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-mazad-border-subtle bg-card p-6 shadow-sm md:p-8",
        className
      )}
    >
      {title ? (
        <div className="mb-6 flex items-start gap-4">
          {icon ? (
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-mazad-primary/8 text-mazad-primary">
              {icon}
            </div>
          ) : null}
          <div className="space-y-1">
            <h2 className="text-lg font-bold tracking-tight text-navy sm:text-xl">
              {title}
            </h2>
            {description ? (
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
      {children}
    </section>
  );
}
