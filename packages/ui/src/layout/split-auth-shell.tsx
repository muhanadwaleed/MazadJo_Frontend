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
    <aside className="relative hidden overflow-hidden border-e border-separator bg-gradient-to-br from-surface via-card to-light-blue/10 lg:flex lg:w-1/2 lg:flex-col lg:justify-between">
      <div className="flex h-full flex-col justify-between p-10 xl:p-14">
        <div className="space-y-2">
          {brand ?? <BrandMark />}
          <p className="text-sm font-semibold tracking-widest text-mazad-primary uppercase">
            {infoPanelTitle}
          </p>
        </div>

        <div className="space-y-8 py-8">
          {infoBlocks.map((block) => (
            <div key={block.title} className="space-y-2">
              <h2 className="text-lg font-semibold text-navy">{block.title}</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {block.body}
              </p>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">{tagline}</p>
      </div>
    </aside>
  );

  const formPanel = (
    <div className="flex w-full flex-col bg-background lg:w-1/2">
      <div className="flex items-center justify-between border-b border-separator bg-card px-4 py-4 lg:px-8">
        <div className="lg:hidden">{brand ?? <BrandMark />}</div>
        <div className="ms-auto">{headerActions}</div>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </div>
          {children}
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
