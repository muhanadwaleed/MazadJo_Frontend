import { getTranslations } from "next-intl/server";

import { FooterNavLinks } from "@/components/layout/footer-nav-links";
import { FooterRegisterCta } from "@/components/layout/footer-register-cta";
import { BrandMark, Container } from "@mazad/ui";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="mt-auto border-t border-separator bg-navy text-white">
      <Container className="py-12 md:py-14">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <div className="flex items-center gap-3">
              <BrandMark variant="light" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/70">
              {t("footer.tagline")}
            </p>
            <p className="mt-6 text-xs text-white/50">{t("footer.copyright")}</p>
          </div>

          <div className="md:col-span-7">
            <p className="mb-4 text-xs font-semibold tracking-widest text-white/50 uppercase">
              {t("footer.explore")}
            </p>
            <FooterNavLinks />
          </div>
        </div>

        <FooterRegisterCta />
      </Container>
    </footer>
  );
}
