"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import { Button, cn } from "@mazad/ui";
import { routes } from "@/config/routes";
import { useRouter } from "@/i18n/navigation";

type AuctionSearchProps = {
  placeholder: string;
  buttonText: string;
  defaultQuery?: string;
  status?: string;
  variant?: "hero" | "page";
  className?: string;
};

export function AuctionSearch({
  placeholder,
  buttonText,
  defaultQuery = "",
  status,
  variant = "page",
  className,
}: AuctionSearchProps) {
  const [query, setQuery] = useState(defaultQuery);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams();
    if (trimmed) params.set("search", trimmed);
    if (status) params.set("status", status);
    const qs = params.toString();
    router.push(qs ? `${routes.auctions}?${qs}` : routes.auctions);
  };

  const isHero = variant === "hero";

  return (
    <form
      onSubmit={handleSearch}
      className={cn(
        "relative flex w-full items-center gap-2 rounded-2xl p-1.5 transition-all duration-200",
        isHero
          ? "max-w-2xl border border-white/15 bg-white/10 shadow-md backdrop-blur-md focus-within:border-white/30 focus-within:bg-white/15"
          : "max-w-xl border border-separator bg-card shadow-sm focus-within:border-mazad-primary/30 focus-within:shadow-md focus-within:ring-[3px] focus-within:ring-mazad-light-blue/15",
        className
      )}
    >
      <div
        className={cn(
          "flex flex-1 items-center gap-2.5 px-3",
          isHero ? "text-white" : "text-foreground"
        )}
      >
        <Search
          className={cn("size-5 shrink-0", isHero ? "opacity-70" : "text-muted-foreground")}
          aria-hidden
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className={cn(
            "w-full border-none bg-transparent p-0 py-2.5 text-sm outline-none focus:ring-0 sm:text-base",
            isHero
              ? "text-white placeholder-white/60"
              : "text-foreground placeholder:text-muted-foreground"
          )}
        />
      </div>
      <Button type="submit" size={isHero ? "default" : "sm"} className="cursor-pointer">
        {buttonText}
      </Button>
    </form>
  );
}
