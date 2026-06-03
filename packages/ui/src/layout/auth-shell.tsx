import { Card, CardContent, CardHeader, CardTitle } from "../components/card";
import { Container } from "./container";

type AuthShellProps = {
  title: string;
  description?: string;
  brand?: React.ReactNode;
  headerActions?: React.ReactNode;
  children: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  brand,
  headerActions,
  children,
}: AuthShellProps) {
  return (
    <div className="mazad-page flex min-h-full flex-col">
      <header className="border-b border-separator bg-card shadow-sm">
        <Container className="py-6">
          <div className="flex items-center justify-between gap-4">
            {brand ?? (
              <span className="text-lg font-bold tracking-tight text-navy">MazadJo</span>
            )}
            {headerActions}
          </div>
        </Container>
      </header>
      <Container size="narrow" className="flex flex-1 flex-col justify-center py-12">
        <Card className="border-mazad-border-subtle shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl">{title}</CardTitle>
            {description ? (
              <p className="text-sm text-muted-foreground">{description}</p>
            ) : null}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </Container>
    </div>
  );
}
