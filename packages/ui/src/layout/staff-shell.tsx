import Link from "next/link";

import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { cn } from "../utils";
import { Container } from "./container";
import { PageHeader } from "./page-header";

type StaffShellProps = {
  navItems: ReadonlyArray<{ label: string; href: string }>;
  pathname: string;
  children: React.ReactNode;
  brandHref?: string;
  brandLabel?: string;
  header?: React.ReactNode;
  signOutLabel?: string;
  onSignOut?: () => void;
};

export function StaffShell({
  navItems,
  pathname,
  children,
  brandHref = "/",
  brandLabel = "MazadJo Staff",
  header,
  signOutLabel = "Sign out",
  onSignOut,
}: StaffShellProps) {
  return (
    <div className="mazad-page flex min-h-screen">
      <aside className="flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar shadow-sm">
        <div className="border-b border-sidebar-border px-5 py-6">
          <Link
            href={brandHref}
            className="text-base font-bold tracking-tight text-navy transition-opacity hover:opacity-80"
          >
            {brandLabel}
          </Link>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className="mazad-sidebar-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {!header && onSignOut ? (
          <div className="border-t border-sidebar-border p-3">
            <Button
              type="button"
              variant="ghost"
              className="w-full justify-start"
              onClick={onSignOut}
            >
              {signOutLabel}
            </Button>
          </div>
        ) : null}
      </aside>
      <div className="flex min-w-0 flex-1 flex-col overflow-auto">
        {header}
        <main className="flex-1">
          <Container className="py-8">{children}</Container>
        </main>
      </div>
    </div>
  );
}

type StaffOverviewProps = {
  navItems: ReadonlyArray<{ label: string; href: string; description?: string }>;
  title: string;
  description: string;
  openWorkspaceLabel?: string;
};

export function StaffOverview({
  navItems,
  title,
  description,
  openWorkspaceLabel = "Open workspace",
}: StaffOverviewProps) {
  return (
    <div className="space-y-8">
      <PageHeader title={title} description={description} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="group block h-full">
            <Card
              interactive
              className={cn(
                "h-full border-mazad-border-subtle p-0 transition-colors",
                "hover:border-mazad-primary/20"
              )}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{item.label}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>
                  {item.description ?? openWorkspaceLabel}
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
