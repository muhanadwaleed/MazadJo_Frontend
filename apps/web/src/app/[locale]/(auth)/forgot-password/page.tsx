import { getTranslations } from "next-intl/server";

import { routes } from "@/config/routes";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { WebSplitAuthShell } from "@/components/layout/web-split-auth-shell";

export async function generateMetadata() {
  const t = await getTranslations("auth");
  return { title: t("forgotPasswordTitle") };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <WebSplitAuthShell
      title={t("forgotPasswordTitle")}
      description={t("forgotPasswordPageDescription")}
      footerHref={routes.login}
      footerLabel={t("backToSignIn")}
    >
      <ForgotPasswordForm />
    </WebSplitAuthShell>
  );
}
