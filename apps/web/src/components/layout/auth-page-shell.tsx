import { Container } from "@mazad/ui";

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
    <Container size="narrow" className="mx-auto flex flex-1 flex-col justify-center py-4">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-navy">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </Container>
  );
}
