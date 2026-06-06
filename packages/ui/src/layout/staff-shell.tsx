import Link from "next/link";

import { Button } from "../components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/card";
import { cn } from "../utils";
import { Container } from "./container";
import { PageHeader } from "./page-header";

/** @deprecated Prefer app-local admin shell. Kept for package API compatibility. */
type StaffShellProps = {
  navItems: ReadonlyArray<{ label: string; href: string }>;
  pathname: string;
  children: React.ReactNode;
  brandHref?: string;
  brandLabel?: string;
  brandSubtitle?: string;
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
  brandSubtitle,
  header,
  signOutLabel = "Sign out",
  onSignOut,
}: StaffShellProps) {
  return (
    <div className="mazad-page flex min-h-screen">
      <aside className="mazad-staff-sidebar flex w-64 shrink-0 flex-col">
        <div className="mazad-staff-sidebar-brand px-5 py-5">
          <Link
            href={brandHref}
            className="block text-base font-bold tracking-tight text-white transition-opacity duration-200 hover:opacity-80"
          >
            {brandLabel}
          </Link>
          {brandSubtitle ? (
            <p className="mt-0.5 text-xs text-white/70">{brandSubtitle}</p>
          ) : null}
        </div>
        <nav className="flex-1 space-y-0.5 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              data-active={pathname === item.href}
              className="mazad-staff-nav-link"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        {!header && onSignOut ? (
          <div className="border-t border-separator p-3">
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
  navItems: ReadonlyArray<{
    label: string;
    href: string;
    description?: string;
    icon?: React.ReactNode;
  }>;
  title: string;
  description: string;
  eyebrow?: string;
  openWorkspaceLabel?: string;
};

export function StaffOverview({
  navItems,
  title,
  description,
  eyebrow,
  openWorkspaceLabel = "Open workspace",
}: StaffOverviewProps) {
  return (
    <div className="space-y-8">
      <PageHeader
        title={title}
        description={description}
        variant="bordered"
        eyebrow={eyebrow}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group block h-full cursor-pointer"
          >
            <Card
              interactive
              className={cn(
                "relative h-full overflow-hidden border-mazad-border-subtle p-0 transition-[border-color,box-shadow] duration-200",
                "hover:border-mazad-primary/30 hover:shadow-md"
              )}
            >
              <div className="absolute inset-y-0 start-0 w-1 bg-mazad-accent/0 transition-colors duration-200 group-hover:bg-mazad-accent" />
              <CardHeader className="flex flex-row items-start gap-3 pb-2 ps-6">
                {item.icon ? (
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-mazad-primary/10 text-mazad-primary transition-colors duration-200 group-hover:bg-mazad-primary group-hover:text-white">
                    {item.icon}
                  </div>
                ) : null}
                <div className="min-w-0 space-y-1">
                  <CardTitle className="text-base font-semibold text-navy">
                    {item.label}
                  </CardTitle>
                  <CardDescription className="leading-relaxed">
                    {item.description ?? openWorkspaceLabel}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0 ps-6 pb-5">
                <p className="text-xs font-semibold text-mazad-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                  {openWorkspaceLabel} →
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
