import { ChevronRight } from "lucide-react";

import type { ProductCategory } from "@mazad/api";
import { pickLocalized } from "@mazad/api";
import { Badge, Card, CardContent } from "@mazad/ui";
import { routes } from "@/config/routes";
import { categoryIconAccents, getCategoryIcon } from "@/lib/category-icons";
import { Link } from "@/i18n/navigation";

type CatalogCategoryCardProps = {
  category: ProductCategory;
  locale: string;
  activeLabel: string;
  inactiveLabel: string;
  accentIndex?: number;
};

export function CatalogCategoryCard({
  category,
  locale,
  activeLabel,
  inactiveLabel,
  accentIndex = 0,
}: CatalogCategoryCardProps) {
  const name = pickLocalized(locale, category.name_ar, category.name_en);
  const Icon = getCategoryIcon(category.name_en || category.name_ar);
  const accent = categoryIconAccents[accentIndex % categoryIconAccents.length];

  return (
    <Link href={routes.catalogCategory(category.id)} className="block h-full">
      <Card
        interactive
        className="h-full border-separator/60 transition-colors hover:border-mazad-primary/25"
      >
        <CardContent className="flex h-full flex-col gap-4 p-5">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex size-12 shrink-0 items-center justify-center rounded-xl transition-all duration-200 group-hover/card:scale-105 ${accent}`}
            >
              <Icon className="size-6 stroke-[1.75]" />
            </div>
            <ChevronRight className="size-5 shrink-0 text-muted-foreground/50 transition-all duration-200 group-hover/card:translate-x-0.5 group-hover/card:text-mazad-primary rtl:rotate-180 rtl:group-hover/card:-translate-x-0.5" />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold leading-snug text-navy">{name}</h3>
            <p className="text-xs capitalize text-muted-foreground">{category.category_type}</p>
          </div>

          <div className="mt-auto pt-1">
            <Badge variant={category.is_active ? "default" : "secondary"}>
              {category.is_active ? activeLabel : inactiveLabel}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
