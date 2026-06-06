"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import { Input } from "@mazad/ui";
import { cn } from "@mazad/ui/utils";
import { useRouter } from "@/i18n/navigation";

export type StaffSearchItem = {
  label: string;
  href: string;
  keywords?: string;
};

export function StaffGlobalSearch({
  items,
  className,
}: {
  items: StaffSearchItem[];
  className?: string;
}) {
  const t = useTranslations("staff");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 6);
    return items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) ||
        item.keywords?.toLowerCase().includes(q) ||
        item.href.toLowerCase().includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function navigate(href: string) {
    router.push(href);
    setQuery("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative w-full max-w-md", className)}>
      <div className="relative">
        <Search
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && results[0]) {
              e.preventDefault();
              navigate(results[0].href);
            }
            if (e.key === "Escape") setOpen(false);
          }}
          placeholder={t("searchPlaceholder")}
          aria-label={t("searchPlaceholder")}
          aria-expanded={open}
          aria-controls="staff-global-search-list"
          className="h-10 cursor-text border-mazad-border-subtle bg-card ps-9 shadow-sm transition-[border-color,box-shadow] duration-200 focus-visible:border-mazad-primary/40 focus-visible:ring-mazad-light-blue/20"
        />
      </div>

      {open && results.length > 0 ? (
        <ul
          id="staff-global-search-list"
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-separator bg-card p-1.5 shadow-lg"
        >
          {results.map((item) => (
            <li key={item.href} role="option">
              <button
                type="button"
                onClick={() => navigate(item.href)}
                className="flex w-full cursor-pointer flex-col rounded-lg px-3 py-2.5 text-start transition-colors duration-200 hover:bg-light-blue/10"
              >
                <span className="text-sm font-semibold text-navy">{item.label}</span>
                <span className="text-xs text-muted-foreground">{item.href}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {open && query.trim() && results.length === 0 ? (
        <div className="absolute z-50 mt-2 w-full rounded-xl border border-separator bg-card px-3 py-2.5 text-sm text-muted-foreground shadow-lg">
          {t("searchNoResults")}
        </div>
      ) : null}
    </div>
  );
}
