import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { RegisterForm } from "@/components/auth/register-form";
import { WebSplitAuthShell } from "@/components/layout/web-split-auth-shell";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("registerTitle") };
}

export default async function RegisterPage() {
  const t = await getTranslations("auth");

  return (
    <WebSplitAuthShell
      title={t("registerTitle")}
      description={t("registerPageDescription")}
      footerHref={routes.login}
      footerLabel={t("signInTitle")}
    >
      <RegisterForm />
    </WebSplitAuthShell>
  );
}
