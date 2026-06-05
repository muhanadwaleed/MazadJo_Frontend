"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { useRouter } from "@/i18n/navigation";
import { routes } from "@/config/routes";
import { Button } from "@mazad/ui";

export function HomeSearch({
  placeholder,
  buttonText,
}: {
  placeholder: string;
  buttonText: string;
}) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`${routes.auctions}?search=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative flex w-full max-w-lg items-center gap-2 rounded-2xl border border-white/15 bg-white/10 p-1.5 shadow-md backdrop-blur-md transition-all focus-within:border-white/30 focus-within:bg-white/15"
    >
      <div className="flex flex-1 items-center gap-2 px-3 text-white">
        <Search className="size-5 shrink-0 opacity-70" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent py-2 text-sm text-white placeholder-white/60 outline-none focus:ring-0 border-none p-0"
        />
      </div>
      <Button
        type="submit"
        size="sm"
        className="rounded-xl bg-mazad-accent text-white hover:bg-accent-dark px-4 font-semibold shadow-sm active:scale-[0.98] transition-transform"
      >
        {buttonText}
      </Button>
    </form>
  );
}
