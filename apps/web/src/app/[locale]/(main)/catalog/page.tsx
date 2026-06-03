import { getLocale, getTranslations } from "next-intl/server";

import { asList, catalogService, pickLocalized } from "@mazad/api";
import { Badge, Container, PageHeader } from "@mazad/ui";
import { Link } from "@/i18n/navigation";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LocationExplorer } from "@/components/catalog/location-explorer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@mazad/ui";

export async function generateMetadata() {
  const t = await getTranslations("catalog");
  return { title: t("title") };
}

export default async function CatalogPage() {
  const locale = await getLocale();
  const t = await getTranslations("catalog");
  const tCommon = await getTranslations("common");
  const tErrors = await getTranslations("errors");

  try {
    const [categories, countries] = await Promise.all([
      catalogService.categories(),
      catalogService.countries(),
    ]);

    const categoryList = asList(categories);
    const countryList = asList(countries);

    return (
      <Container className="space-y-10">
        <PageHeader title={t("title")} description={t("description")} />

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("categories")}</h2>
          {categoryList.length === 0 ? (
            <EmptyState
              title={t("noCategoriesTitle")}
              description={t("noCategoriesDescription")}
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryList.map((cat) => (
                <li key={cat.id}>
                  <Link href={`/catalog/categories/${cat.id}`}>
                    <Card className="transition-colors hover:border-primary/40">
                      <CardHeader>
                        <CardTitle className="text-base">
                          {pickLocalized(locale, cat.name_ar, cat.name_en)}
                        </CardTitle>
                        <CardDescription>{cat.category_type}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={cat.is_active ? "default" : "secondary"}>
                          {cat.is_active ? tCommon("active") : tCommon("inactive")}
                        </Badge>
                      </CardContent>
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("locationExplorerTitle")}</h2>
          <LocationExplorer
            locale={locale}
            countries={countryList}
            labels={{
              title: t("locationExplorerTitle"),
              country: t("country"),
              city: t("city"),
              area: t("area"),
              selectCountry: t("selectCountry"),
              selectCity: t("selectCity"),
              selectArea: t("selectArea"),
              loading: t("loading"),
              selection: t("selection"),
              none: t("noneSelected"),
            }}
          />
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold">{t("countries")}</h2>
          {countryList.length === 0 ? (
            <EmptyState title={t("noCountriesTitle")} />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3">
              {countryList.map((country) => (
                <li
                  key={country.id}
                  className="rounded-lg border border-border px-4 py-3 text-sm"
                >
                  <p className="font-medium">
                    {pickLocalized(locale, country.name_ar, country.name_en)}
                  </p>
                  <p className="text-muted-foreground">{country.code}</p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    );
  } catch {
    return (
      <Container>
        <ErrorState title={tErrors("genericTitle")} message={t("loadError")} />
      </Container>
    );
  }
}
