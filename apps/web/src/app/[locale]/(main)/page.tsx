import { getLocale, getTranslations } from "next-intl/server";
import {
  Car,
  Building,
  Laptop,
  Palette,
  Shirt,
  Folder,
  ShieldCheck,
  Clock,
  MapPin,
  Smartphone,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

import { routes } from "@/config/routes";
import { auctionsService, catalogService, asList, pickLocalized } from "@mazad/api";
import { Container, EmptyState } from "@mazad/ui";
import { AuctionCard } from "@/components/auctions/auction-card";
import { ButtonLink } from "@/components/ui/button-link";
import { HomeSearch } from "@/components/home/home-search";
import { Link } from "@/i18n/navigation";

// Lucide Icon mapping based on category names
function getCategoryIcon(name: string) {
  const n = name.toLowerCase();
  if (n.includes("car") || n.includes("vehicle") || n.includes("سيار")) return Car;
  if (n.includes("real") || n.includes("property") || n.includes("building") || n.includes("عقار")) return Building;
  if (n.includes("electron") || n.includes("device") || n.includes("كمبيوتر") || n.includes("أجهز")) return Laptop;
  if (n.includes("art") || n.includes("collect") || n.includes("فخر") || n.includes("تحف")) return Palette;
  if (n.includes("cloth") || n.includes("fashion") || n.includes("ملاب")) return Shirt;
  return Folder;
}

export default async function HomePage() {
  const locale = await getLocale();
  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");
  const tMeta = await getTranslations("metadata");

  let auctions: Awaited<ReturnType<typeof auctionsService.list>>["results"] = [];
  let categories: any[] = [];

  // Fetch active auctions
  try {
    const data = await auctionsService.list({
      status: "active",
      page_size: 6,
    });
    auctions = data.results;
  } catch {
    auctions = [];
  }

  // Fetch catalog categories with fallback for visual completeness
  try {
    const rawCategories = await catalogService.categories();
    categories = asList(rawCategories).filter((c) => c.is_active);
  } catch {
    categories = [];
  }

  // Fallback categories if database is not seeded yet
  if (categories.length === 0) {
    categories = [
      { id: "1", name_en: "Vehicles", name_ar: "السيارات", icon: Car },
      { id: "2", name_en: "Electronics", name_ar: "الأجهزة", icon: Laptop },
      { id: "3", name_en: "Real Estate", name_ar: "العقارات", icon: Building },
      { id: "4", name_en: "Collectibles", name_ar: "المقتنيات", icon: Palette },
      { id: "5", name_en: "Fashion", name_ar: "الأزياء", icon: Shirt },
    ];
  }

  return (
    <Container className="space-y-12 py-2 md:py-6">
      {/* 1. Brand Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-brand-gradient px-6 py-12 text-white shadow-xl sm:px-12 sm:py-16 md:py-20 lg:px-16">
        {/* Background micro-accents */}
        <div className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(circle_at_top_right,var(--mazad-light-blue)_25%,transparent_60%)]" />
        <div className="pointer-events-none absolute -right-16 -top-16 size-64 rounded-full bg-white/5 blur-2xl" />

        <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Text Content & Search */}
          <div className="space-y-6 lg:col-span-7 xl:col-span-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mazad-accent opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-mazad-accent"></span>
              </span>
              {t("eyebrow")}
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl lg:leading-[1.15]">
              {t("title")}
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-white/80 sm:text-lg">
              {t("description")}
            </p>

            {/* Instant Search Bar */}
            <div className="pt-2">
              <HomeSearch
                placeholder={t("searchPlaceholder")}
                buttonText={t("searchButton")}
              />
            </div>

            {/* Hero Quick Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink
                size="lg"
                href={routes.auctions}
                className="bg-white text-navy hover:bg-white/90 font-semibold shadow-md"
              >
                {t("browseAuctions")}
              </ButtonLink>
              <ButtonLink
                size="lg"
                variant="outline"
                href={routes.catalog}
                className="border-white/30 text-white hover:bg-white/10 font-semibold backdrop-blur-sm"
              >
                {t("exploreCatalog")}
              </ButtonLink>
            </div>
          </div>

          {/* Visual Element (Logo Box) */}
          <div className="hidden lg:col-span-5 lg:block xl:col-span-4 justify-self-end">
            <div className="relative rotate-3 rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-md transition-transform duration-300 hover:rotate-0">
              <div className="absolute -left-6 -top-6 rounded-2xl bg-mazad-accent p-3 shadow-lg text-white">
                <Clock className="size-6 animate-pulse" />
              </div>
              <div className="flex flex-col items-center text-center space-y-4">
                <img
                  src="/logo.png"
                  alt="MazadJo"
                  className="size-32 object-contain rounded-2xl shadow-md border border-white/10 bg-navy/20"
                />
                <div>
                  <h3 className="text-xl font-bold">{tMeta("siteName")}</h3>
                  <p className="text-xs text-white/60 mt-1">{tCommon("language") === "English" ? "سوق المزادات الأردني" : "Jordanian Auction Marketplace"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categories Horizontal Selector */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-navy sm:text-xl">
            {tCommon("language") === "English" ? "Browse Categories" : "تصفح الفئات"}
          </h2>
          <Link
            href={routes.catalog}
            className="flex items-center gap-1 text-sm font-semibold text-mazad-primary hover:opacity-85"
          >
            {tCommon("viewAll")}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>

        {/* Scrollable Categories List */}
        <div className="flex gap-4 overflow-x-auto pb-2 snap-x scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {categories.map((cat) => {
            const Icon = cat.icon || getCategoryIcon(cat.name_en || "");
            const displayName = pickLocalized(locale, cat.name_ar, cat.name_en);
            return (
              <Link
                key={cat.id}
                href={cat.icon ? routes.catalog : `/catalog/categories/${cat.id}`}
                className="flex min-w-[76px] flex-col items-center gap-2 snap-align-start shrink-0 text-center group"
              >
                <div className="flex size-14 items-center justify-center rounded-2xl border border-separator bg-card text-navy/70 shadow-sm transition-all duration-200 group-hover:-translate-y-1 group-hover:border-mazad-primary group-hover:text-mazad-primary group-hover:shadow-md">
                  <Icon className="size-6 stroke-[1.75]" />
                </div>
                <span className="text-xs font-semibold text-navy/80 group-hover:text-mazad-primary transition-colors truncate max-w-[80px]">
                  {displayName}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Active Auctions Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex size-2 rounded-full bg-mazad-accent animate-pulse" />
            <h2 className="text-lg font-bold tracking-tight text-navy sm:text-xl">
              {t("activeAuctionsTitle")}
            </h2>
          </div>
          <Link
            href={routes.auctions}
            className="flex items-center gap-1 text-sm font-semibold text-mazad-primary hover:opacity-85"
          >
            {tCommon("viewAll")}
            <ChevronRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>

        {auctions.length > 0 ? (
          /* Mobile horizontal scroll / desktop grid layout wrapper */
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 md:snap-none">
            {auctions.map((auction) => (
              <div
                key={auction.id}
                className="min-w-[290px] w-[290px] snap-align-start shrink-0 md:w-auto md:min-w-0 md:shrink h-full"
              >
                <AuctionCard auction={auction} />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title={t("noActiveTitle")}
            description={t("noActiveDescription")}
            action={
              <ButtonLink href={routes.auctions}>{t("browseAllAuctions")}</ButtonLink>
            }
          />
        )}
      </section>

      {/* 4. Platform Features Credibility Section */}
      <section className="rounded-3xl border border-separator bg-gradient-to-br from-surface to-card p-6 md:p-8">
        <div className="mx-auto max-w-xl text-center space-y-3 mb-8">
          <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
            {tCommon("language") === "English" ? "Why Choose MazadJo?" : "لماذا تختار مزادجو؟"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {tCommon("language") === "English"
              ? "We provide Jordan's most transparent and interactive live bidding experience."
              : "نحن نقدم تجربة المزايدة الحية الأكثر شفافية وتفاعلية في الأردن."}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Feature 1 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3 rounded-2xl bg-card border border-separator/50 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-mazad-primary/5 text-mazad-primary">
              <ShieldCheck className="size-6 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold text-navy">
              {tCommon("language") === "English" ? "Staff Reviewed" : "مراجعة العروض"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tCommon("language") === "English"
                ? "Every auction listing is verified by staff before going live."
                : "تتم مراجعة كل عرض والتحقق منه من قبل موظفينا قبل تفعيله."}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3 rounded-2xl bg-card border border-separator/50 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-mazad-primary/5 text-mazad-primary">
              <Clock className="size-6 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold text-navy">
              {tCommon("language") === "English" ? "Real-time Bids" : "مزايدة فورية"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tCommon("language") === "English"
                ? "Instant updates on bidding activity and countdowns."
                : "تحديثات فورية على نشاط المزايدة والعد التنازلي للمزادات."}
            </p>
          </div>

          {/* Feature 3 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3 rounded-2xl bg-card border border-separator/50 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-mazad-primary/5 text-mazad-primary">
              <MapPin className="size-6 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold text-navy">
              {tCommon("language") === "English" ? "Local Support" : "دعم محلي"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tCommon("language") === "English"
                ? "Bids in Jordanian Dinar (JOD) with local delivery rules."
                : "المزايدة بالدينار الأردني ومعايير استلام محلية متكاملة."}
            </p>
          </div>

          {/* Feature 4 */}
          <div className="flex flex-col items-center text-center p-4 space-y-3 rounded-2xl bg-card border border-separator/50 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="flex size-12 items-center justify-center rounded-xl bg-mazad-primary/5 text-mazad-primary">
              <Smartphone className="size-6 stroke-[2]" />
            </div>
            <h3 className="text-sm font-bold text-navy">
              {tCommon("language") === "English" ? "Mobile Optimized" : "شاشات الهاتف"}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {tCommon("language") === "English"
                ? "Bid, create drafts, and monitor on any screen size."
                : "تابع مزاداتك، شارك، وأنشئ عروضك بكل سهولة من هاتفك الذكي."}
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
