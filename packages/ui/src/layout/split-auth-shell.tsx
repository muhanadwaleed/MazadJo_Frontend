import { cn } from "../utils";
import { BrandMark } from "./brand-mark";

export type AuthInfoBlock = {
  title: string;
  body: string;
};

type SplitAuthShellProps = {
  title: string;
  description?: string;
  brand?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
  infoBlocks?: AuthInfoBlock[];
  tagline?: string;
  /** When true, form panel appears first (useful for RTL). */
  reversePanels?: boolean;
  infoPanelTitle?: string;
  className?: string;
};

export function SplitAuthShell({
  title,
  description,
  brand,
  headerActions,
  children,
  infoBlocks = [],
  tagline = "MazadJo — Jordan's auction marketplace",
  reversePanels = false,
  infoPanelTitle = "About MazadJo",
  className,
}: SplitAuthShellProps) {
  const infoPanel = (
    <aside className="relative hidden overflow-hidden border-e border-separator bg-gradient-to-br from-navy via-mazad-primary to-light-blue lg:flex lg:w-[45%] lg:flex-col lg:justify-between">
      <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,var(--mazad-light-blue)_20%,transparent_55%)]" />
      <div className="relative flex h-full flex-col justify-between p-10 text-white xl:p-14">
        <div className="space-y-3">
          {brand ?? <BrandMark variant="light" />}
          <p className="text-xs font-semibold tracking-widest text-white/70 uppercase">
            {infoPanelTitle}
          </p>
        </div>

        <div className="space-y-8 py-8">
          {infoBlocks.map((block) => (
            <div
              key={block.title}
              className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
            >
              <h2 className="text-base font-semibold text-white">{block.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">{block.body}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-white/50">{tagline}</p>
      </div>
    </aside>
  );

  const formPanel = (
    <div className="flex w-full flex-col bg-surface lg:w-[55%]">
      <div className="flex items-center justify-between border-b border-separator bg-card px-4 py-4 lg:px-8">
        <div className="lg:hidden">{brand ?? <BrandMark />}</div>
        <div className="ms-auto">{headerActions}</div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy sm:text-3xl">
              {title}
            </h1>
            {description ? (
              <p className="text-base leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}
          </div>
          <div className="rounded-2xl border border-mazad-border-subtle bg-card p-6 shadow-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "mazad-page flex min-h-screen flex-col lg:flex-row",
        reversePanels && "lg:flex-row-reverse",
        className
      )}
    >
      {infoPanel}
      {formPanel}
    </div>
  );
}
