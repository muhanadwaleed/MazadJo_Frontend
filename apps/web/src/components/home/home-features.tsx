"use client";

import { motion } from "framer-motion";
import { Clock, MapPin, ShieldCheck, Smartphone } from "lucide-react";
import { useTranslations } from "next-intl";

import { staggerContainer, staggerItem } from "@mazad/ui";

const features = [
  { key: "staffReviewed" as const, icon: ShieldCheck },
  { key: "realTimeBids" as const, icon: Clock },
  { key: "localSupport" as const, icon: MapPin },
  { key: "mobileOptimized" as const, icon: Smartphone },
];

export function HomeFeatures() {
  const t = useTranslations("home.features");

  return (
    <section className="rounded-2xl border border-separator bg-gradient-to-br from-surface to-card p-6 shadow-sm md:p-8">
      <div className="mx-auto mb-8 max-w-xl space-y-2 text-center">
        <h2 className="text-xl font-bold tracking-tight text-navy sm:text-2xl">
          {t("title")}
        </h2>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {t("description")}
        </p>
      </div>

      <motion.div
        variants={staggerContainer}
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-80px" }}
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      >
        {features.map(({ key, icon: Icon }) => (
          <motion.div
            key={key}
            variants={staggerItem}
            className="group flex cursor-default flex-col items-center rounded-2xl border border-separator/60 bg-card p-5 text-center shadow-sm transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-mazad-primary/8 text-mazad-primary transition-all duration-200 group-hover:scale-105 group-hover:bg-mazad-accent/15 group-hover:text-mazad-accent">
              <Icon className="size-6 stroke-[2]" aria-hidden />
            </div>
            <h3 className="text-sm font-bold text-navy">{t(`${key}.title`)}</h3>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              {t(`${key}.description`)}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
