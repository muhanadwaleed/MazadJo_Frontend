import { ChevronRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { cn } from "@mazad/ui/utils";

export function PageBackLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-semibold text-mazad-primary hover:opacity-85",
        className
      )}
    >
      <ChevronRight className="size-4 rotate-180 rtl:rotate-0" />
      {children}
    </Link>
  );
}
