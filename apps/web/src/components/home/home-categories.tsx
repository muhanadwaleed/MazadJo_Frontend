"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

import { pickLocalized } from "@mazad/api";
import { staggerContainer, staggerItem } from "@mazad/ui";
import { routes } from "@/config/routes";
import { Link } from "@/i18n/navigation";
import { getCategoryIcon } from "@/lib/category-icons";

type Category = {
  id: string | number;
  name_en?: string;
  name_ar?: string;
  icon?: React.ComponentType<{ className?: string }>;
  is_active?: boolean;
};

export function HomeCategories({ categories }: { categories: Category[] }) {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCommon = useTranslations("common");

  return (
    <section className="space-y-5">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-widest text-mazad-primary uppercase">
            {t("categoriesEyebrow")}
          </p>
          <h2 className="mt-1 text-xl font-bold tracking-tight text-navy sm:text-2xl">
            {t("categoriesTitle")}
          </h2>
        </div>
        <Link
          href={routes.catalog}
          className="inline-flex cursor-pointer items-center gap-1 text-sm font-semibold text-mazad-primary transition-opacity duration-200 hover:opacity-85"
        >
          {tCommon("viewAll")}
          <ChevronRight className="size-4 rtl:rotate-180" />
        </Link>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] snap-x [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((cat) => {
          const Icon = cat.icon || getCategoryIcon(cat.name_en || "");
          const displayName = pickLocalized(locale, cat.name_ar, cat.name_en);
          return (
            <motion.div key={cat.id} variants={staggerItem} className="shrink-0 snap-start">
              <Link
                href={cat.icon ? routes.catalog : `/catalog/categories/${cat.id}`}
                className="group flex min-w-[84px] flex-col items-center gap-2.5 text-center"
              >
                <div className="flex size-16 items-center justify-center rounded-2xl border border-separator bg-card text-navy/70 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-mazad-primary/40 group-hover:text-mazad-primary group-hover:shadow-md">
                  <Icon className="size-7 stroke-[1.75]" />
                </div>
                <span className="max-w-[88px] truncate text-xs font-semibold text-navy/80 transition-colors duration-200 group-hover:text-mazad-primary">
                  {displayName}
                </span>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
