import { cn } from "../utils";

export type PageHeroProps = {
  eyebrow?: React.ReactNode;
  title: string;
  description: string;
  actions?: React.ReactNode;
  aside?: React.ReactNode;
  footer?: React.ReactNode;
  variant?: "gradient" | "surface";
  className?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
  aside,
  footer,
  variant = "gradient",
  className,
}: PageHeroProps) {
  const isGradient = variant === "gradient";

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-2xl px-6 py-10 shadow-lg sm:px-10 sm:py-14 lg:px-12",
        isGradient
          ? "bg-brand-gradient text-white"
          : "border border-separator bg-gradient-to-br from-card via-card to-surface text-navy",
        className
      )}
    >
      {isGradient ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,var(--mazad-light-blue)_25%,transparent_60%)]" />
          <div className="pointer-events-none absolute -left-12 -bottom-12 size-56 rounded-full bg-white/5 blur-2xl" />
        </>
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,color-mix(in_srgb,var(--mazad-light-blue)_10%,transparent),transparent_55%)]" />
      )}

      <div
        className={cn(
          "relative grid items-center gap-8",
          aside ? "lg:grid-cols-12 lg:gap-10" : undefined
        )}
      >
        <div className={cn("space-y-5", aside ? "lg:col-span-8" : "max-w-3xl")}>
          {eyebrow ? (
            <div
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm",
                isGradient
                  ? "bg-white/10 text-white"
                  : "border border-separator bg-surface text-mazad-primary"
              )}
            >
              {eyebrow}
            </div>
          ) : null}
          <h1
            className={cn(
              "text-3xl font-bold tracking-tight sm:text-4xl md:text-[2.5rem] md:leading-tight",
              !isGradient && "text-navy"
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              "max-w-2xl text-base leading-relaxed sm:text-lg",
              isGradient ? "text-white/80" : "text-muted-foreground"
            )}
          >
            {description}
          </p>
          {actions ? (
            <div className="flex flex-wrap gap-3 pt-1">{actions}</div>
          ) : null}
        </div>

        {aside ? <div className="lg:col-span-4">{aside}</div> : null}
      </div>

      {footer ? (
        <div className="relative mt-8 max-w-2xl">{footer}</div>
      ) : null}
    </section>
  );
}
