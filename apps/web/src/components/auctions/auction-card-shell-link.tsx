"use client";

import { AuctionCardShell, type AuctionCardShellProps } from "@mazad/ui";
import { Link } from "@/i18n/navigation";

type AuctionCardShellLinkProps = AuctionCardShellProps & {
  href: string;
};

export function AuctionCardShellLink({ href, ...props }: AuctionCardShellLinkProps) {
  return <AuctionCardShell {...props} href={href} linkComponent={Link} />;
}
