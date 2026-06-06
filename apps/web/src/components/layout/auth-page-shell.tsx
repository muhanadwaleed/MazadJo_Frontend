import { BrandMark, Container } from "@mazad/ui";

export function AuthPageShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <Container size="narrow" className="mx-auto flex flex-1 flex-col justify-center py-6 md:py-10">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex flex-col items-center space-y-6 text-center sm:items-start sm:text-start">
          <BrandMark />
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
        </div>
        <div className="rounded-2xl border border-mazad-border-subtle bg-card p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </Container>
  );
}
