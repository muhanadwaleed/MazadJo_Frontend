import type { VariantProps } from "class-variance-authority";

import { Link } from "@/i18n/navigation";
import { buttonVariants } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";

type ButtonLinkProps = React.ComponentProps<typeof Link> &
  VariantProps<typeof buttonVariants>;

export function ButtonLink({
  className,
  variant,
  size,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
