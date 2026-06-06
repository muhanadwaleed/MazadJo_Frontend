import { getLocale, getTranslations } from "next-intl/server";
import { LayoutGrid, MapPin } from "lucide-react";

import { routes } from "@/config/routes";
import { asList, catalogService } from "@mazad/api";
import { Container, ContentSection, SectionHeader } from "@mazad/ui";
import { CatalogCategoryCard } from "@/components/catalog/catalog-category-card";
import { CatalogCountryCard } from "@/components/catalog/catalog-country-card";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { LocationExplorer } from "@/components/catalog/location-explorer";
import { PageHero } from "@/components/layout/page-hero";
import { ButtonLink } from "@/components/ui/button-link";

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

    const categoryList = asList(categories).filter((cat) => cat.is_active);
    const countryList = asList(countries).filter((country) => country.is_active);

    return (
      <Container className="space-y-10 py-2 md:py-4">
        <PageHero
          eyebrow={<LayoutGrid className="size-3.5" />}
          title={t("title")}
          description={t("description")}
          actions={
            <>
              <ButtonLink size="lg" variant="heroPrimary" href={routes.auctions}>
                {t("browseAuctions")}
              </ButtonLink>
              <ButtonLink size="lg" variant="heroOutline" href="/catalog#categories">
                {t("categories")}
              </ButtonLink>
            </>
          }
          aside={
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold">{categoryList.length}</p>
                <p className="mt-1 text-xs font-medium text-white/70">{t("categories")}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-3xl font-bold">{countryList.length}</p>
                <p className="mt-1 text-xs font-medium text-white/70">{t("countries")}</p>
              </div>
            </div>
          }
        />

        <section id="categories" className="scroll-mt-28 space-y-6">
          <SectionHeader
            title={t("categories")}
            description={t("categoriesDescription")}
            badge={<LayoutGrid className="size-5 text-mazad-primary" aria-hidden />}
          />

          {categoryList.length === 0 ? (
            <EmptyState
              title={t("noCategoriesTitle")}
              description={t("noCategoriesDescription")}
            />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryList.map((cat, index) => (
                <li key={cat.id} className="h-full">
                  <CatalogCategoryCard
                    category={cat}
                    locale={locale}
                    activeLabel={tCommon("active")}
                    inactiveLabel={tCommon("inactive")}
                    accentIndex={index}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>

        <ContentSection
          title={t("locationExplorerTitle")}
          description={t("locationDescription")}
          icon={<MapPin className="size-6 stroke-[1.75]" aria-hidden />}
        >
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
        </ContentSection>

        <section className="space-y-6">
          <SectionHeader
            title={t("countries")}
            description={t("countriesDescription")}
            badge={<MapPin className="size-5 text-mazad-primary" aria-hidden />}
          />

          {countryList.length === 0 ? (
            <EmptyState title={t("noCountriesTitle")} />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {countryList.map((country) => (
                <CatalogCountryCard key={country.id} country={country} locale={locale} />
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
