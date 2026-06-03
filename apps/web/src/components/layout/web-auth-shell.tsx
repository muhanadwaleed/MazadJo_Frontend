import { Link } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { AuthShell, BrandMark } from "@mazad/ui";

import { LocaleSwitcher } from "@/components/layout/locale-switcher";

export function WebAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <AuthShell
      title={title}
      description={description}
      brand={
        <Link href={routes.home} className="text-primary-foreground">
          <BrandMark />
        </Link>
      }
      headerActions={<LocaleSwitcher />}
    >
      {children}
    </AuthShell>
  );
}
