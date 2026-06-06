import { auctionsService, catalogService, asList } from "@mazad/api";
import { Container } from "@mazad/ui";
import { ScrollReveal } from "@/components/common/scroll-reveal";
import { HomeActiveAuctionsSection } from "@/components/home/home-active-auctions-section";
import { HomeCategories } from "@/components/home/home-categories";
import { HomeFeatures } from "@/components/home/home-features";
import { HomeHero } from "@/components/home/home-hero";

export default async function HomePage() {
  let auctions: Awaited<ReturnType<typeof auctionsService.list>>["results"] = [];
  let categories: Array<{
    id: string | number;
    name_en?: string;
    name_ar?: string;
    is_active?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  }> = [];

  try {
    const data = await auctionsService.list({
      status: "active",
      page_size: 6,
    });
    auctions = data.results;
  } catch {
    auctions = [];
  }

  try {
    const rawCategories = await catalogService.categories();
    categories = asList(rawCategories).filter((c) => c.is_active);
  } catch {
    categories = [];
  }

  if (categories.length === 0) {
    categories = [
      { id: "1", name_en: "Vehicles", name_ar: "السيارات" },
      { id: "2", name_en: "Electronics", name_ar: "الأجهزة" },
      { id: "3", name_en: "Real Estate", name_ar: "العقارات" },
      { id: "4", name_en: "Collectibles", name_ar: "المقتنيات" },
      { id: "5", name_en: "Fashion", name_ar: "الأزياء" },
    ];
  }

  return (
    <Container className="space-y-16 py-2 md:py-4">
      <HomeHero />

      <ScrollReveal delay={0.05}>
        <HomeCategories categories={categories} />
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <HomeActiveAuctionsSection auctions={auctions} />
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <HomeFeatures />
      </ScrollReveal>
    </Container>
  );
}
