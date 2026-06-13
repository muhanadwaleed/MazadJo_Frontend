"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Clock } from "lucide-react";
import { useTranslations } from "next-intl";

import { HeroSection, motionDuration, motionEase } from "@mazad/ui";
import { routes } from "@/config/routes";
import { AddAuctionButton } from "@/components/auctions/add-auction-button";
import { HomeSearch } from "@/components/home/home-search";
import { ButtonLink } from "@/components/ui/button-link";

export function HomeHero() {
  const t = useTranslations("home");
  const tMeta = useTranslations("metadata");
  const prefersReducedMotion = useReducedMotion();

  return (
    <HeroSection
      eyebrow={
        <>
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-mazad-accent opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-mazad-accent" />
          </span>
          {t("eyebrow")}
        </>
      }
      title={t("title")}
      description={t("description")}
      search={
        <HomeSearch
          variant="page"
          placeholder={t("searchPlaceholder")}
          buttonText={t("searchButton")}
        />
      }
      primaryAction={
        <div className="relative">
          <div
            className="pointer-events-none absolute -inset-1 rounded-2xl bg-mazad-accent/20 blur-md"
            aria-hidden
          />
          <ButtonLink size="lg" href={routes.auctions}>
            {t("browseAuctions")}
          </ButtonLink>
        </div>
      }
      secondaryAction={
        <div className="flex flex-wrap gap-3">
          <AddAuctionButton size="lg" />
          <ButtonLink size="lg" variant="outline" href={routes.catalog}>
            {t("exploreCatalog")}
          </ButtonLink>
        </div>
      }
      visual={
        <motion.div
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -10, 0], rotate: [0, 1.5, 0, -1.5, 0] }
          }
          transition={
            prefersReducedMotion
              ? undefined
              : { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }
          className="relative rounded-2xl border border-separator bg-card p-8 shadow-lg"
        >
          <motion.div
            animate={prefersReducedMotion ? undefined : { scale: [1, 1.05, 1] }}
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
            className="absolute -start-4 -top-4 flex size-12 items-center justify-center rounded-xl bg-mazad-accent text-white shadow-md"
          >
            <Clock className="size-6" aria-hidden />
          </motion.div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <motion.img
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: motionDuration.slow, ease: motionEase, delay: 0.2 }}
              src="/logo.png"
              alt={tMeta("siteName")}
              className="size-28 rounded-2xl border border-separator bg-surface object-contain shadow-sm"
            />
            <div>
              <h3 className="text-lg font-bold text-navy">{tMeta("siteName")}</h3>
              <p className="mt-1 text-xs text-muted-foreground">{t("heroTagline")}</p>
            </div>
          </div>
        </motion.div>
      }
    />
  );
}
